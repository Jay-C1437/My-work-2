// JavaScript - Task Manager Logic
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('taskManagerTasks')) || [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.createStars();
        this.createParticles();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    createStars() {
        const starsContainer = document.getElementById('stars');
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            starsContainer.appendChild(star);
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        setInterval(() => {
            if (particlesContainer.children.length < 10) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
                particlesContainer.appendChild(particle);

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 30000);
            }
        }, 2000);
    }

    bindEvents() {
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        document.getElementById('tasksContainer').addEventListener('click', (e) => {
            const taskCard = e.target.closest('.task-card');
            if (!taskCard) return;

            const taskId = parseInt(taskCard.dataset.taskId);

            if (e.target.classList.contains('complete-btn')) {
                this.toggleTask(taskId);
            } else if (e.target.classList.contains('edit-btn')) {
                this.editTask(taskId);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteTask(taskId);
            }
        });
    }

    addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;

        if (!title) {
            this.showNotification('Please enter a task title!', 'error');
            return;
        }

        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, { title, description, priority });
        } else {
            const task = {
                id: Date.now(),
                title,
                description,
                priority,
                completed: false,
                createdAt: new Date().toISOString()
            };
            this.tasks.push(task);
            this.showNotification('Task added successfully!', 'success');
        }

        this.clearInputs();
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    updateTask(taskId, updatedData) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedData };
            this.editingTaskId = null;
            document.getElementById('addTaskBtn').textContent = 'Add Task';
            this.showNotification('Task updated successfully!', 'success');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('addTaskBtn').textContent = 'Update Task';
            this.editingTaskId = taskId;
            document.getElementById('taskTitle').focus();
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification(
                task.completed ? 'Task completed!' : 'Task reopened!',
                task.completed ? 'success' : 'info'
            );
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Task deleted successfully!', 'success');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTasks();
    }

    getFilteredTasks() {
        return this.tasks.filter(task => {
            switch (this.currentFilter) {
                case 'pending':
                    return !task.completed;
                case 'completed':
                    return task.completed;
                case 'high':
                    return task.priority === 'high';
                case 'medium':
                    return task.priority === 'medium';
                case 'low':
                    return task.priority === 'low';
                default:
                    return true;
            }
        });
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks found</h3>
                    <p>Add some tasks to get started with your cosmic journey!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredTasks.map(task => `
            <div class="task-card ${task.completed ? 'task-completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-priority priority-${task.priority}">${task.priority}</div>
                </div>
                <div class="task-description">${this.escapeHtml(task.description)}</div>
                <div class="task-date">Created: ${new Date(task.createdAt).toLocaleDateString()}</div>
                <div class="task-actions">
                    <button class="task-btn complete-btn">
                        ${task.completed ? 'Reopen' : 'Complete'}
                    </button>
                    <button class="task-btn edit-btn">Edit</button>
                    <button class="task-btn delete-btn">Delete</button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    clearInputs() {
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskPriority').value = 'low';
    }

    saveTasks() {
        localStorage.setItem('cosmicTasks', JSON.stringify(this.tasks));
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? 'linear-gradient(45deg, #7bed9f, #70a1ff)' : 
                       type === 'error' ? 'linear-gradient(45deg, #ff4757, #ff3838)' : 
                       'linear-gradient(45deg, #ffa502, #ff6348)'};
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});