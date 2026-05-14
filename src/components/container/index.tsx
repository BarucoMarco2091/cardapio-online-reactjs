import { type ReactNode } from "react"

interface ContainerProps {
    children: ReactNode;
}

export function Container({children}: ContainerProps) {
    return(
        <div className="justify-center items-center max-w-7xl m-auto">
            {children}
        </div>
    )
}