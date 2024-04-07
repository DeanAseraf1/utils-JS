export type TDirection = {x:-1|0|1, y:-1|0|1}

export type TWindowedComponentProps = {
    children?: React.ReactNode,
    className?:string,
    includeCloseButton?:boolean,
    openningDirection?:TDirection,
    closeOnClickOutside?:boolean,
    closeOnClickEscape?:boolean

    buttonClassName?:string,
    buttonChildren?:React.ReactNode,
    closeButtonClassName?:string,
    closeButtonChildren?:React.ReactNode,

    buttonRenderer?: (
        props: {
            className?: string,
            children?:React.ReactNode,
            onClick:React.MouseEventHandler<HTMLButtonElement>,
        },
        isOpen?:boolean,
    ) => React.ReactNode,

    wrapperRenderer?: (
        props: {
            className?: string, 
            children?: React.ReactNode, 
            ref: (instance:any)=>void
        }
    ) => React.ReactNode

    renderer?: (
        props: {
            className?: string, 
            children?: React.ReactNode
        },
        closeButtonProps?: {
            className?: string,
            children?: React.ReactNode,
            onClick: React.MouseEventHandler<HTMLButtonElement>, 
        }
    ) => React.ReactNode,
}