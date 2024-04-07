const dynamoDB = {};

const bll = (dynamoDB, config = {_ : { 
    ProjectionExpression: "id"
 }}) => {

    // const execute = async (dynamoDBFunc, params) => {
    //     const result = await dynamoDBFunc(params).promise();
    //     return {
    //         data: result?.data?.Items ?? result?.err ?? {}, 
    //         isSuccesful: result?.data?.Items?.length >= 0 ?? false,
    //         lastEvaluatedKey: result?.lastEvaluatedKey ?? undefined
    //     }
    // }

    // const paginationsParamsBuilder = (params, lastEvaluatedKey, countPerPage) => {
    //     return {
    //         ...params, 
    //         Limit: countPerPage,
    //         ExclusiveStartKey: lastEvaluatedKey ?? undefined
    //     }
    // }

    // const scanPagination = async (params, lastEvaluatedKey, countPerPage) => {
    //     return await execute(dynamoDB.scan, paginationsParamsBuilder(params, lastEvaluatedKey, countPerPage));
    // };

    // const queryPaginnation = async (params, lastEvaluatedKey, countPerPage) => {
    //     const result = await dynamoDB.query({
    //         ...params, 
    //         Limit: countPerPage,
    //         ExclusiveStartKey: lastEvaluatedKey ?? undefined
    //     }).promise();
    //     return {
    //         data: result?.data?.Items ?? result?.err ?? {}, 
    //         isSuccesful: result?.data?.Items?.length >= 0 ?? false,
    //         lastEvaluatedKey: result?.lastEvaluatedKey ?? undefined
    //     }
    // }

    const batchGetter = async (funcName, params) => {
        let result, ExclusiveStartKey;
          let accumulated = [];
          do {
            result = await dynamoDB[funcName]({
              ...params,
              ExclusiveStartKey,
              Limit: 100,
            }).promise();
            ExclusiveStartKey = result.LastEvaluatedKey;
            accumulated = [...accumulated, ...result.Items];
          } while (result.LastEvaluatedKey);
          return accumulated;
          // try{
          // }
          // catch(err){
          //   return [];
          // }
      
    }

    return {
        batchScan: (params, schema = "_") => {

            const params = {...(typeof(params) === "object" ? params : {})}
            const projectionExpression = params?.ProjectionExpression ?? (schema && config[+schema || 0]?.ProjectionExpression) ?? undefined;
            const result = batchGetter("scan", {...params, ProjectionExpression: projectionExpression});
            return ;
        },
        batchQuery: (params) => {
            return batchGetter("query", params);
        },
        batchPut: (params) => {

        }
    }
}