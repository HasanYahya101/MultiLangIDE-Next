import React, { useState, useRef } from 'react'
import { ChevronRight, ChevronDown, Folder, File, Plus, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

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
                        className="h-6 py-1 px-2 w-32"
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
                                    className="h-6 py-1 px-2"
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

export default function Component() {
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
        <div className="w-64 border rounded-md overflow-hidden">
            <div className="p-2 bg-secondary text-secondary-foreground font-medium">File Explorer</div>
            <div className="p-2">
                <FileTreeNode data={fileStructure} level={0} onSelect={handleSelect} onUpdate={handleUpdate} />
            </div>
            {selectedNode && (
                <div className="p-2 bg-muted text-muted-foreground text-sm">
                    Selected: {selectedNode.name}
                </div>
            )}
        </div>
    )
}