import { Component, JSX } from "solid-js";

interface PopoverProps {
    visible: boolean;
    close: () => void;
    children?: JSX.Element;
}

const Popover: Component<PopoverProps> = (props: PopoverProps) => {
    const visible = () => props.visible;

    return (
        <div class={`${!visible() && "hidden"} absolute left-0 top-0 w-[100vw] h-[100vh] flex flex-row justify-center items-center`}>
            <div class="absolute bg-black opacity-50 w-full h-full left-0 top-0 z-40" onClick={props.close}>
            
            </div>
            <div class="rounded bg-white w-[75vw] max-w-96 h-[40vh] z-50">
                {props.children}
            </div>
        </div>
    )
}

export default Popover;