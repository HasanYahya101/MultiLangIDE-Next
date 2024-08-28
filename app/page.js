"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Code2 } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import Editor from "@monaco-editor/react"


export default function Home() {
	const [code, setCode] = useState('')
	const [lines, setLines] = useState(['1'])
	const textareaRef = useRef(null)
	const lineNumbersRef = useRef(null)

	useEffect(() => {
		const lineCount = code.split('\n').length
		setLines(Array.from({ length: lineCount }, (_, i) => (i + 1).toString()))
	}, [code])

	const handleCodeChange = (e) => {
		setCode(e.target.value)
	}

	const syncScroll = (e) => {
		if (textareaRef.current && lineNumbersRef.current) {
			lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
		}
	}


	return (
		<div className="flex h-screen w-full bg-background text-foreground">
			<div className="flex h-full w-full flex-col">
				<div className="flex h-full w-full">
					<div className="flex h-full w-[300px] flex-col border-r border-muted">
						<div
							className="flex items-center justify-between border-b border-muted px-4 py-2">
							<div className="text-sm font-medium">Explorer</div>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon">
									<FolderIcon className="h-5 w-5" />
								</Button>
								<Button variant="ghost" size="icon">
									<PlusIcon className="h-5 w-5" />
								</Button>
							</div>
						</div>
						<div className="flex-1 overflow-auto">
							<div className="px-4 py-2">
								<div className="mb-2 text-xs font-medium text-muted-foreground">src</div>
								<div className="grid gap-1">
									<Link
										href="#"
										className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
										prefetch={false}>
										<FileIcon className="h-4 w-4" />
										<div className="truncate text-sm">App.tsx</div>
									</Link>
									<Link
										href="#"
										className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
										prefetch={false}>
										<FileIcon className="h-4 w-4" />
										<div className="truncate text-sm">index.tsx</div>
									</Link>
									<Link
										href="#"
										className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
										prefetch={false}>
										<FolderIcon className="h-4 w-4" />
										<div className="truncate text-sm">components</div>
									</Link>
									<Link
										href="#"
										className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
										prefetch={false}>
										<FolderIcon className="h-4 w-4" />
										<div className="truncate text-sm">utils</div>
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div className="flex h-full flex-1 flex-col">
						<div
							className="flex items-center justify-between px-4 py-2">
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon">
									<FileIcon className="h-5 w-5" />
								</Button>
								<div className="text-sm font-medium">App.tsx</div>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon">
									<TerminalIcon className="h-5 w-5" />
								</Button>
								<Button variant="ghost" size="icon">
									<BugIcon className="h-5 w-5" />
								</Button>
								<Button variant="ghost" size="icon">
									<GitBranchIcon className="h-5 w-5" />
								</Button>
								<Button variant="ghost" size="icon">
									<ExpandIcon className="h-5 w-5" />
								</Button>
							</div>
						</div>
						<div className="flex h-full w-full flex-1 overflow-auto">
							<div className="flex h-full w-full flex-col">
								<div className="flex-1 overflow-hidden">
									<div className="h-full w-full">
										<Editor className="h-full w-full"
										//theme="vs-dark"
										></Editor>
									</div>
								</div>
								<div
									className="flex items-center justify-between border-t border-muted px-4 py-2">
									<div className="flex items-center gap-2">
										<div className="text-sm font-medium">1:1</div>
										<Separator orientation="vertical" className="h-4" />
										<div className="text-sm text-muted-foreground">Ln 1, Col 1</div>
									</div>
									<div className="flex items-center gap-2">
										<Button variant="ghost" size="icon">
											<ZapIcon className="h-5 w-5" />
										</Button>
										<Button variant="ghost" size="icon">
											<ChevronDownIcon className="h-5 w-5" />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="flex h-full w-[300px] flex-col border-l border-muted">
						<div
							className="flex items-center justify-between border-b border-muted px-4 py-2">
							<div className="text-sm font-medium">Outline</div>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon">
									<MaximizeIcon className="h-5 w-5" />
								</Button>
							</div>
						</div>
						<div className="flex-1 overflow-auto">
							<div className="px-4 py-2">
								<div className="mb-2 text-xs font-medium text-muted-foreground">App.tsx</div>
								<div className="grid gap-1">
									<div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
										<div className="h-4 w-4 rounded-full bg-primary" />
										<div className="truncate text-sm">
											<span className="font-medium">App</span> component
										</div>
									</div>
									<div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
										<div className="h-4 w-4 rounded-full bg-primary" />
										<div className="truncate text-sm">
											<span className="font-medium">return</span> statement
										</div>
									</div>
									<div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
										<div className="h-4 w-4 rounded-full bg-primary" />
										<div className="truncate text-sm">
											<span className="font-medium">div</span> element
										</div>
									</div>
									<div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
										<div className="h-4 w-4 rounded-full bg-primary" />
										<div className="truncate text-sm">
											<span className="font-medium">h1</span> element
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function BugIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="m8 2 1.88 1.88" />
			<path d="M14.12 3.88 16 2" />
			<path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
			<path
				d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
			<path d="M12 20v-9" />
			<path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
			<path d="M6 13H2" />
			<path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
			<path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
			<path d="M22 13h-4" />
			<path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
		</svg>)
	);
}


function ChevronDownIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="m6 9 6 6 6-6" />
		</svg>)
	);
}


function ExpandIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
			<path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
			<path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
			<path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
		</svg>)
	);
}


function FileIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
			<path d="M14 2v4a2 2 0 0 0 2 2h4" />
		</svg>)
	);
}


function FolderIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path
				d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
		</svg>)
	);
}


function GitBranchIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<line x1="6" x2="6" y1="3" y2="15" />
			<circle cx="18" cy="6" r="3" />
			<circle cx="6" cy="18" r="3" />
			<path d="M18 9a9 9 0 0 1-9 9" />
		</svg>)
	);
}


function MaximizeIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M8 3H5a2 2 0 0 0-2 2v3" />
			<path d="M21 8V5a2 2 0 0 0-2-2h-3" />
			<path d="M3 16v3a2 2 0 0 0 2 2h3" />
			<path d="M16 21h3a2 2 0 0 0 2-2v-3" />
		</svg>)
	);
}


function MenuIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<line x1="4" x2="20" y1="12" y2="12" />
			<line x1="4" x2="20" y1="6" y2="6" />
			<line x1="4" x2="20" y1="18" y2="18" />
		</svg>)
	);
}


function PlusIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>)
	);
}


function PowerIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M12 2v10" />
			<path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
		</svg>)
	);
}


function TerminalIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<polyline points="4 17 10 11 4 5" />
			<line x1="12" x2="20" y1="19" y2="19" />
		</svg>)
	);
}


function ZapIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path
				d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
		</svg>)
	);
}
