import { Component, JSX } from "solid-js";

interface PopoverProps {
    visible: boolean;
    close: () => void;
    children?: JSX.Element;
}

const Popover: Component<PopoverProps> = (props: PopoverProps) => {
    const visible = () => props.visible;

    return (
        <div class={`${!visible() && "hidden"} absolute left-0 top-0 w-full h-[100vh] flex flex-row justify-center`}>
            <div class="absolute bg-black opacity-50 w-full h-full left-0 top-0 z-40" onClick={props.close}>
            
            </div>
            <div class="relative rounded w-[75vw] mt-[20vh] max-w-96 h-fit z-50 p-4 bg-gray-50">
                {props.children}
                <button class="w-6 h-6 text-[0.7rem] text-center absolute right-[-12px] top-[-12px] rounded-full border border-gray-600 bg-gray-50 hover:bg-gray-300 active:bg-gray-400 transition align-middle text-red-600" onClick={props.close}>
                    ✘
                </button>
            </div>
        </div>
    )
}

export default Popover;