"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function FileButtonToolTip({ content, children }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent className='py-1 px-2 rounded-lg'>
                    <span className="text-xs select-none text-muted-foreground">{content}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
