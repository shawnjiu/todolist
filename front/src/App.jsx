import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import './App.css';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});



function App() {
 
  const [originalTodos, setOriginalTodos] = useState([]);  
  const [workingTodos, setWorkingTodos] = useState([]);    
  const [currentTodo, setCurrentTodo] = useState({ title: "", completed: false, _id: null });
  const [isEdit, setIsEdit] = useState(false);

   
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
     
       const todosArray = Array.isArray(res.data) ? res.data : res.data.todos || [];

  setOriginalTodos(todosArray);
  setWorkingTodos(todosArray.map(todo => ({ ...todo })));
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

 
  const addTodo = async () => {
    if (!currentTodo.title) return;
    await api.post("/todos", currentTodo);
    setCurrentTodo({ title: "", completed: false, _id: null });
    await fetchTodos();
  };

 
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      if (isEdit) submitEditedTodo();
      else addTodo();
    }
  };

 
  const toggleTodo = async (item) => {
    if (isEdit && currentTodo._id === item._id) {
     
      setCurrentTodo(prev => ({ ...prev, completed: !prev.completed }));
    } else {
    
      await api.patch(`/todos/${item._id}`, { completed: !item.completed });
      await fetchTodos();
    }
  };

 
  const editTodo = async (id) => {
    const res = await api.get(`/todos/${id}`);
    setCurrentTodo(res.data);
    setIsEdit(true);
  };

 
  const submitEditedTodo = async () => {
    const updated = {
      title: currentTodo.title,
      completed: currentTodo.completed,
      updatedAt: new Date()
    };
    await api.put(`/todos/${currentTodo._id}`, updated);
    setCurrentTodo({ title: "", completed: false, _id: null });
    setIsEdit(false);
    await fetchTodos();
  };

 
  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    await fetchTodos();
  };

 
  const handleCancel = () => {
    const original = originalTodos.find(t => t._id === currentTodo._id);
    if (original) setCurrentTodo({ ...original });
    setIsEdit(false);
    setCurrentTodo({ title: "", completed: false, _id: null });

  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
 
      {isEdit ? (
        <div className="flex gap-2">
          <Input
            placeholder="Edit todo..."
            value={currentTodo.title}
            onChange={(e) => setCurrentTodo({ ...currentTodo, title: e.target.value })}
            onKeyDown={handleEnter}
          />
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={submitEditedTodo}>Submit</Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="New todo..."
            value={currentTodo.title}
            onChange={(e) => setCurrentTodo({ ...currentTodo, title: e.target.value })}
            onKeyDown={handleEnter}
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
      )}

    
      {workingTodos.map((item) => (
        <Card key={item._id}>
          <CardContent className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isEdit && currentTodo._id === item._id ? currentTodo.completed : item.completed}
                onCheckedChange={() => toggleTodo(item)}
                className="border-3 border-red-600"
              />
              <span className={item.completed ? "line-through" : "font-bold text-red-500"}>
                {item.title}
              </span>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => editTodo(item._id)}>Edit</Button>
              <Button variant="destructive" onClick={() => deleteTodo(item._id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default App;