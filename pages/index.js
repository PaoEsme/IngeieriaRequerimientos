import React, { useState, useEffect } from 'react';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Media',
    });
    const [editingTaskId, setEditingTaskId] = useState(null); 
    const [editingTask, setEditingTask] = useState(null); 

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleInputChange = (e) => {
        if (editingTaskId) {
            setEditingTask({ ...editingTask, [e.target.name]: e.target.value });
        } else {
            setNewTask({ ...newTask, [e.target.name]: e.target.value });
        }
    };

    const addTask = () => {
        if (!newTask.title) {
            alert('El título es obligatorio.');
            return;
        }
        setTasks([
            ...tasks,
            { ...newTask, id: Date.now(), isCompleted: false, isDeleted: false },
        ]);
        setNewTask({ title: '', description: '', dueDate: '', priority: 'Media' });
    };

    const editTask = (task) => {
        setEditingTaskId(task.id);
        setEditingTask({ ...task });
    };

    const saveEditedTask = () => {
        if (!editingTask.title) {
            alert('El título es obligatorio.');
            return;
        }
        setTasks(
            tasks.map((task) =>
                task.id === editingTaskId ? { ...editingTask } : task
            )
        );
        setEditingTaskId(null);
        setEditingTask(null);
    };

    const completeTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, isCompleted: true } : task
            )
        );
    };

    const restoreTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, isCompleted: false } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gestor de Tareas</h1>

            <div style={styles.card}>
                <h2 style={styles.subtitle}>
                    {editingTaskId ? 'Editar Tarea' : 'Crear Nueva Tarea'}
                </h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={editingTaskId ? editingTask.title : newTask.title}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={editingTaskId ? editingTask.description : newTask.description}
                    onChange={handleInputChange}
                    style={styles.textarea}
                />
                <input
                    type="date"
                    name="dueDate"
                    value={editingTaskId ? editingTask.dueDate : newTask.dueDate}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <select
                    name="priority"
                    value={editingTaskId ? editingTask.priority : newTask.priority}
                    onChange={handleInputChange}
                    style={styles.select}
                >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
                {editingTaskId ? (
                    <button onClick={saveEditedTask} style={styles.button}>
                        Guardar Cambios
                    </button>
                ) : (
                    <button onClick={addTask} style={styles.button}>
                        Agregar
                    </button>
                )}
            </div>

            <div style={styles.section}>
                <h2 style={styles.subtitle}>Tareas Pendientes</h2>
                {tasks.filter((task) => !task.isDeleted && !task.isCompleted).map((task) => (
                    <div key={task.id} style={styles.taskCard}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Fecha de vencimiento: {task.dueDate}</p>
                        <p>Prioridad: {task.priority}</p>
                        <div style={styles.buttonGroup}>
                            <button
                                onClick={() => completeTask(task.id)}
                                style={styles.completeButton}
                            >
                                Completar
                            </button>
                            <button
                                onClick={() => editTask(task)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => deleteTask(task.id)}
                                style={styles.deleteButton}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.section}>
                <h2 style={styles.subtitle}>Tareas Completadas</h2>
                {tasks.filter((task) => task.isCompleted).map((task) => (
                    <div
                        key={task.id}
                        style={{
                            ...styles.taskCard,
                            backgroundColor: '#C8E6C9',
                        }}
                    >
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Fecha de vencimiento: {task.dueDate}</p>
                        <p>Prioridad: {task.priority}</p>
                        <div style={styles.buttonGroup}>
                            <button
                                onClick={() => restoreTask(task.id)}
                                style={styles.restoreButton}
                            >
                                Restaurar
                            </button>
                            <button
                                onClick={() => deleteTask(task.id)}
                                style={styles.deleteButton}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#FCE4EC',
        color: '#4A4A4A',
        minHeight: '100vh',
    },
    title: {
        textAlign: 'center',
        fontSize: '2.5rem',
        color: '#8E24AA',
    },
    subtitle: {
        fontSize: '1.5rem',
        color: '#3949AB',
    },
    card: {
        backgroundColor: '#F8BBD0',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #D1C4E9',
    },
    textarea: {
        display: 'block',
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #D1C4E9',
    },
    select: {
        display: 'block',
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #D1C4E9',
    },
    button: {
        backgroundColor: '#81D4FA',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    completeButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    restoreButton: {
        backgroundColor: '#FFB74D',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    editButton: {
        backgroundColor: '#FFD54F',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    taskCard: {
        backgroundColor: '#E1BEE7',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '15px',
    },
    buttonGroup: {
        display: 'flex',
        gap: '15px',
        marginTop: '10px',
    },
    section: {
        marginTop: '30px',
    },
};
