import React from "react";
// export const dbBuilder = {
//     response: (data:any, err:any, isMuiltiple = false, hasPagination = false, includeCount = false) => {
//         if(err) return {err, isSuccessful: false};
//         else if(data){
//             let result:any = {data: null, count:0, exclusiveStartKey: undefined, hasMoreData: undefined};
    
//             if(isMuiltiple && data?.Items){
//                 result.data = data?.Items || [];
//             }
//             else if(!isMuiltiple && (data?.Items?.length || 0) > 0){
//                 result.data = data?.Items || [];
//             }
//             else if(!includeCount){
//                 return {err: {msg: "No Items that match your'e request was found."}, isSuccessful: false}
//                 //err
//             }
    
//             if(hasPagination && data?.LastEvaluatedKey){
//                 result.exclusiveStartKey = data.LastEvaluatedKey;
//             }
//             else if(!hasPagination && data?.LastEvaluatedKey){
//                 result.hasMoreData = true;
//             }
    
//             if(includeCount && data?.Count){
//                 result.count = data.Count;
//             }
//             else if(includeCount && !data?.Count){
//                 return {err: {msg: "Count wasn't found in the response."}, isSuccessful: false}
//             }
    
//             return {...result, isSuccessful: true};
//         //     if(data?.Items?.length > 0)
//         //     return {data: isMuiltiple ? data.Items : data.Items[0], isSuccessful: true}
//         }
//         else{
//             return {err: {msg: "Data wasn't found in the response."}, isSuccessful: false}
//         }
//         // else if (data && data?.Items && data?.Items?.length > 0) 
//         // else if (data && data?.Items && isMuiltiple) return {data: data.Items, isSuccessful: true};
//     },

//     params: (tableName: string, projectionExpression: string = "id", options: {includePagination: boolean, onlyCount: boolean} = {includePagination: false, onlyCount: false}, ...params:any) => {
//         return {
//             TableName: tableName,
//             ProjectionExpression: !options?.onlyCount ? projectionExpression || undefined : undefined,
//             ExclusiveStartKey: (options?.includePagination && (params?.length || 0) > 0) ? (params?.exclusiveStartKey || undefined) : undefined,
//             Select: projectionExpression ? "SPECIFIC_ATTRIBUTES" : options?.onlyCount ? "COUNT" : undefined,
//             ...(params || {})
//         }
//     }
// }

const buildResponse: (isSuccessful:boolean, value:Object, message?:string) => {
    data?:any, 
    err?:any,
    message?:string, 
    isSuccessful:boolean
} = (isSuccessful, value, message) => {
    const messageObject = message !== undefined ? {message} : {}
    return {...value, ...messageObject, isSuccessful}
}

export const resBuilder: {
    success: (options:{data?:any, message:string} | {data:any, message?:string}) => {
        data?:any, 
        message?:string, 
        isSuccessful:boolean
    },
    error: (options:{err?:any, message:string} | {err:any, message?:string}) => {
        err?:any,
        message?:string, 
        isSuccessful:boolean
    }
} = {
    success: (options) => {
        const {data, message} = options;
        const dataObject = data !== undefined ? {data} : {}
        return buildResponse(true, dataObject, message);
    },
    error: (options) => {
        const {err, message} = options;
        const errorObject = err !== undefined ? {err} : {}
        return buildResponse(false, errorObject, message);
    }
}

export const dbHelper = (db:any) => {
        const singleQuery = async (tableName: string, primeryKeyValue: any, primeryKeyName = "id", indexName = "id-index", onlyData = false) => {
            try{
                const result = await db.query({
                    TableName: tableName,
                    IndexName: indexName,
                    KeyConditionExpression: "#PK = :PK",
                    ExpressionAttributeValues: {
                        "#PK": primeryKeyName
                    },
                    ExpressionAttributeNames: {
                        ":PK": primeryKeyValue
                    }
                }).promise();

                if((result?.Items?.length ?? 0) >= 1){
                    if(onlyData){
                        return result.Items[0];
                    }
                    return resBuilder.success({data: result.Items[0]})
                    // return {isSuccessful: true, data: result.Items[0]};
                }

            } catch(err){
                if(onlyData){
                    return undefined;
                }
                return resBuilder.error({err, message: `An error accured while trying to query a single item ${primeryKeyName}=${primeryKeyValue} from ${tableName}.`});
                // return {isSuccessful:false, err};
            }
        }

        const multiQuery = async (tableName: string, primeryKeyValues: any[], primeryKeyName = "id", indexName = "id-index", onlyData = false, filterErrors = false) => {
            const promises = primeryKeyValues.map(value=>singleQuery(tableName, value, primeryKeyName, indexName, onlyData));
            try{
                const results = await Promise.all(promises);
                if(filterErrors){
                    return results.filter(res => onlyData && res || !onlyData && res?.isSuccessful)
                }
                return results;
            }catch(err){
                if(onlyData){
                    return [];
                }
                return resBuilder.error({err, message: `An error accured while trying to query multiple items from ${tableName}`});
            }

        }

        const batchScan = async (tableName: string, attributesMap: Object, limit = 100, onlyData = false, filterErrors = false) => {
                let result, ExclusiveStartKey;
                let accumulated:any[] = [];
                try{
                    do {
                        try{
                            result = await db.scan({
                            TableName: tableName,
                            ProjectionExpression: Object.keys(attributesMap).join(", "),
                            ExclusiveStartKey,
                            Limit: limit,
                            }).promise();
                            ExclusiveStartKey = result?.LastEvaluatedKey ?? undefined;
                            accumulated = [...accumulated, ...(onlyData ? (result?.Items ?? []) : resBuilder.success({data: result}))];
                        }catch(err){
                            if(!onlyData && !filterErrors){
                                accumulated = [...accumulated, resBuilder.error({err, message: `An error accured while trying to scan batch of items from ${tableName}.`})]
                            }
                        }
                    } while (result.LastEvaluatedKey);
                    if(onlyData){
                        return accumulated;
                    }
                    if(filterErrors){
                        return {data: accumulated.filter(res=>res.isSuccessful === true), hasFullyLoaded: true}
                    }
                    return {data: accumulated, hasFullyLoaded: true};
                }
                catch(err){
                    if(onlyData){
                        return accumulated;
                    }
                    if(filterErrors){
                        return {data: accumulated.filter(res=>res.isSuccessful === true), hasFullyLoaded: false}
                    }
                    return {data: accumulated, err: err, hasFullyLoaded: false}
                }
                
        }

    
    return{
        singleQuery,
        multiQuery,
        batchScan,
    }
    
}

// const app:any = {};
// const dynamoDb:any = {};
// const dbHelp = dbHelper(dynamoDb);
// app.get("by-id/:id", (req:any,res:any)=>{
//     dbHelp.singleQuery("", req.params.id).then(res=>{
//         res.json(res);
//     }).catch(err=>{
//         res.json(err);
//     })
// })

// app.get("/", async (req:any, res:any)=>{
//     try{
//         return await dbHelp.batchScan("", {id: ""});
//     }
//     catch(err){
//         return 
//     }
// })
