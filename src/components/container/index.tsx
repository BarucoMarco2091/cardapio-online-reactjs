import { type ReactNode } from "react"

interface ContainerProps {
    children: ReactNode;
}

export function Container({children}: ContainerProps) {
    return(
        <div className="justify-center items-center max-w-7xl m-auto md:px-0.5 px-1.5">
            {children}
        </div>
    )
}