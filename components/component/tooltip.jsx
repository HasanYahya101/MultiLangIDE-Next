"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ButtonToolTip({ content, children }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent className='py-1 px-2 rounded-lg'>
                    <span className="text-[13px] select-none text-muted-foreground">{content}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
