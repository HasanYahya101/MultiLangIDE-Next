"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronDown, Folder, File, Plus, Edit2, FilePlus, FolderPlus } from 'lucide-react'
import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const FileTreeNode = ({ data, level, onSelect, onUpdate }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isAdding, setIsAdding] = useState(false)
	const [isRenaming, setIsRenaming] = useState(false)
	const [newItemName, setNewItemName] = useState('')
	const [newItemType, setNewItemType] = useState(null)
	const inputRef = useRef(null)
	const isFolder = data.type === 'folder'

	const handleToggle = (e) => {
		e.stopPropagation()
		if (isFolder) {
			setIsOpen(!isOpen)
		}
	}

	const handleSelect = () => {
		onSelect(data)
	}

	const handleAddItem = (type) => {
		setIsAdding(true)
		setNewItemType(type)
		setNewItemName('')
		setTimeout(() => inputRef.current?.focus(), 0)
	}

	const handleRename = (e) => {
		e.stopPropagation()
		setIsRenaming(true)
		setNewItemName(data.name)
		setTimeout(() => inputRef.current?.focus(), 0)
	}

	const handleInputChange = (e) => {
		setNewItemName(e.target.value)
	}

	const handleInputKeyDown = (e) => {
		if (e.key === 'Enter' && newItemName) {
			if (isAdding && newItemType) {
				const newItem = {
					id: `${data.id}/${newItemName}`,
					name: newItemName,
					type: newItemType,
					children: newItemType === 'folder' ? [] : undefined
				}
				const updatedData = {
					...data,
					children: [...(data.children || []), newItem]
				}
				onUpdate(updatedData)
				setIsAdding(false)
				setNewItemName('')
				setNewItemType(null)
				setIsOpen(true)
			} else if (isRenaming) {
				const updatedData = { ...data, name: newItemName }
				onUpdate(updatedData)
				setIsRenaming(false)
			}
		} else if (e.key === 'Escape') {
			setIsAdding(false)
			setIsRenaming(false)
			setNewItemName('')
			setNewItemType(null)
		}
	}

	return (
		<div>
			<div
				className={cn(
					"flex items-center py-1 px-2 cursor-pointer hover:bg-accent",
					!isFolder && "hover:text-accent-foreground"
				)}
				style={{ paddingLeft: `${level * 16}px` }}
				onClick={handleSelect}
			>
				{isFolder && (
					<motion.span
						className="mr-1"
						onClick={handleToggle}
						animate={{ rotate: isOpen ? 90 : 0 }}
						transition={{ duration: 0.2 }}
					>
						<ChevronRight size={16} />
					</motion.span>
				)}
				{isFolder ? <Folder size={16} className="mr-2" /> : <File size={16} className="mr-2" />}
				{isRenaming ? (
					<Input
						ref={inputRef}
						type="text"
						value={newItemName}
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						className="h-6 py-1 px-2 w-32 mr-1 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-gray-400"
					/>
				) : (
					<span>{data.name}</span>
				)}
				<Button
					variant="ghost"
					size="icon"
					className="ml-auto h-6 w-6"
					onClick={handleRename}
				>
					<Edit2 size={16} />
					<span className="sr-only">Rename</span>
				</Button>
				{isFolder && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-6 w-6">
								<Plus size={16} />
								<span className="sr-only">Add item</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onSelect={() => handleAddItem('file')}>Add File</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => handleAddItem('folder')}>Add Folder</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
			<AnimatePresence initial={false}>
				{isFolder && isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
					>
						{data.children?.map((child) => (
							<FileTreeNode
								key={child.id}
								data={child}
								level={level + 1}
								onSelect={onSelect}
								onUpdate={(updatedChild) => {
									const updatedChildren = data.children?.map(c => c.id === updatedChild.id ? updatedChild : c)
									onUpdate({ ...data, children: updatedChildren })
								}}
							/>
						))}
						{isAdding && (
							<div className="flex items-center py-1 px-2" style={{ paddingLeft: `${(level + 1) * 16}px` }}>
								{newItemType === 'folder' ? <Folder size={16} className="mr-2" /> : <File size={16} className="mr-2" />}
								<Input
									ref={inputRef}
									type="text"
									value={newItemName}
									onChange={handleInputChange}
									onKeyDown={handleInputKeyDown}
									className="h-6 py-1 px-2 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-gray-400"
									placeholder={`New ${newItemType}`}
								/>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default function Home() {
	const [code, setCode] = useState("");
	const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
	const [totalLines, setTotalLines] = useState(1);
	const editorRef = useRef(null);
	const modelRef = useRef(null);

	const handleEditorDidMount = (editor) => {
		editorRef.current = editor;
		modelRef.current = editor.getModel();

		editor.onDidChangeCursorPosition((event) => {
			if (modelRef.current) {
				const position = editor.getPosition();
				setCursorPosition(position);
			}
		});

		editor.onDidChangeModelContent((event) => {
			if (modelRef.current) {
				const lines = modelRef.current.getLineCount();
				setTotalLines(lines);
			}
		});
	};

	const [selectedNode, setSelectedNode] = useState(null)
	const [fileStructure, setFileStructure] = useState({
		id: 'root',
		name: 'root',
		type: 'folder',
		children: [
			{
				id: 'src',
				name: 'src',
				type: 'folder',
				children: [
					{ id: 'src/index.js', name: 'index.js', type: 'file' },
					{ id: 'src/styles.css', name: 'styles.css', type: 'file' },
				],
			},
			{
				id: 'public',
				name: 'public',
				type: 'folder',
				children: [
					{ id: 'public/index.html', name: 'index.html', type: 'file' },
					{ id: 'public/favicon.ico', name: 'favicon.ico', type: 'file' },
				],
			},
			{ id: 'package.json', name: 'package.json', type: 'file' },
			{ id: 'README.md', name: 'README.md', type: 'file' },
		],
	})

	const handleSelect = (node) => {
		setSelectedNode(node)
	}

	const handleUpdate = (updatedData) => {
		setFileStructure(updatedData)
	}

	return (
		<div className="flex h-screen w-full bg-background text-foreground border border-muted">
			<div className="flex h-full w-full flex-col">
				<div className="flex h-full w-full">
					<div className="flex h-full w-[300px] flex-col border-r border-muted">
						<div
							className="flex items-center justify-between border-b border-muted px-4 py-2 h-[50px]">
							<div className="text-sm font-medium">Explorer</div>
							<div className="flex items-center gap-1">
								<Button variant="ghost" size="smallicon">
									<FolderPlus className="h-5 w-5 translate-y-[1px]" />
								</Button>
								<Button variant="ghost" size="smallicon">
									<FilePlus className="h-5 w-5" />
								</Button>
							</div>
						</div>
						<div className="flex-1 overflow-auto">
							<ScrollArea className="w-full h-[89vh]">
								<div className="px-1.5 py-2">
									<div className="gap-y-1 h-full w-full">
										<div className="p-2">
											<FileTreeNode data={fileStructure} level={0} onSelect={handleSelect} onUpdate={handleUpdate} />
										</div>
									</div>
								</div>
							</ScrollArea>
						</div>
					</div>
					<div className="flex h-full flex-1 flex-col">
						<div
							className="flex items-center border-b border-muted justify-between px-4 py-2 h-[50px]">
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
										<Editor className="h-full w-full" onMount={handleEditorDidMount}
											defaultLanguage="javascript"
											defaultValue=""
											tabSize={4}
											onChange={(value) => setCode(value)}
											value={code}
											options={{
												padding: { top: 10 },
												minimap: { enabled: true, showRegionSectionHeaders: true },
												stickyScroll: { enabled: true, defaultModel: "foldingProviderModel" },
												formatOnPaste: true,
												formatOnType: true,
												insertSpaces: true,
												tabSize: 4,
												autoIndent: true,
											}}
											language="javascript"
										//theme="vs-dark"
										></Editor>
									</div>
								</div>
								<div
									className="flex items-center justify-between border-t border-muted px-4 py-2">
									<div className="flex items-center gap-2">
										<div className="text-sm font-medium">{cursorPosition.lineNumber}:{totalLines}</div>
										<Separator orientation="vertical" className="h-4" />
										<div className="text-sm text-muted-foreground">Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}</div>
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
							className="flex items-center justify-between border-b border-muted px-4 py-2 h-[50px]">
							<div className="text-sm font-medium">Outline</div>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="smallicon">
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
		</div >
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
