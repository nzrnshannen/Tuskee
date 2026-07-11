import React, { useState } from 'react';
import { PixelPaw, PixelTrash, PixelPencil, PixelCatEars } from './PixelIcons';

export default function TodoSection({ todos, onAddTodo, onToggleTodo, onDeleteTodo, onEditTodo }) {
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    onAddTodo(newTodoText.trim());
    setNewTodoText('');
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      onEditTodo(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    else if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="retro-window w-full flex flex-col h-full select-none">
      {/* Title Bar */}
      <div className="retro-window-header bg-[#DCD2F7] text-brand-plum">
        <PixelCatEars />
        <div className="retro-window-title">
          <span>🐾 Chores.exe - Todo List Manager</span>
        </div>
      </div>

      {/* OS Menu bar showing stats */}
      <div className="flex justify-end px-6 py-1 bg-brand-cream/50 text-[0.65rem] border-b-2 border-brand-plum/10 font-medium">
        <span className="font-pixel text-[8px] text-brand-plum/70">
          Done: {completedCount}/{todos.length}
        </span>
      </div>

      {/* Task List container */}
      <div className="flex-grow px-6 pt-4 pb-4 overflow-y-auto flex flex-col gap-2 max-h-[300px]">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <span style={{ fontSize: '2rem', marginBottom: '4px' }}>📁</span>
            <span className="font-pixel text-[8px] text-brand-plum/60 leading-normal">
              No active tasks found.<br />Create one below to start.
            </span>
          </div>
        ) : (
          todos.map((todo) => (
            <div 
              key={todo.id} 
              className={`flex items-center gap-3 p-2 bg-[#FFFDF9] border-2 border-[#7d6972]/30 hover:bg-brand-white transition-colors ${todo.completed ? 'opacity-70' : ''}`}
            >
              {/* Retro Checkbox Box */}
              <div 
                className="w-5 h-5 bg-[#FFFDF9] border-2 border-[#7d6972]/60 flex items-center justify-center shrink-0 shadow-inner cursor-pointer"
                onClick={() => onToggleTodo(todo.id)}
              >
                {todo.completed && <PixelPaw />}
              </div>

              {/* Todo Text or Edit Input */}
              {editingId === todo.id ? (
                <input
                  type="text"
                  className="flex-grow bg-[#FFFDF9] border-2 border-brand-plum p-1 text-xs text-brand-plum outline-none"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={handleEditKeyDown}
                  maxLength={60}
                  autoFocus
                />
              ) : (
                <span 
                  className={`text-xs font-medium text-brand-plum flex-grow cursor-pointer ${todo.completed ? 'line-through text-brand-plum/50' : ''}`}
                  onDoubleClick={() => startEditing(todo)}
                  title="Double-click to edit"
                >
                  {todo.text}
                </span>
              )}

              {/* Edit button */}
              <button 
                className="p-1 hover:bg-blue-100/40 transition-colors shrink-0" 
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(todo);
                }}
                title="Edit task"
                aria-label="Edit task"
              >
                <PixelPencil />
              </button>

              {/* Trash button */}
              <button 
                className="p-1 hover:bg-brand-pink/20 transition-colors shrink-0" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTodo(todo.id);
                }}
                title="Delete task"
                aria-label="Delete task"
              >
                <PixelTrash />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Form Input at the bottom */}
      <form className="px-6 pb-6 pt-3 border-t-2 border-brand-plum/10 bg-brand-cream/30 flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow bg-[#FFFDF9] border-2 border-[#7d6972] p-2 text-xs text-brand-plum outline-none shadow-inner"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="+ Add item..."
          maxLength={60}
        />
        <button type="submit" className="retro-btn whitespace-nowrap shrink-0">
          + ADD
        </button>
      </form>
    </div>
  );
}
