import type Todo from '../../types/todo';
import { Component } from '@angular/core';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  todos: Todo[];
  priorityFilter: string;
  descriptionFilter: string;
  isModalOpen: boolean;
  newTodo: Todo;

  constructor(private todoService: TodoService) {
    this.priorityFilter = '';
    this.descriptionFilter = '';
    this.todos = [];
    this.isModalOpen = false;
    this.newTodo = {} as Todo;
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  async loadTodos(): Promise<void> {
    this.todoService.getTodos().subscribe((todos) => (this.todos = todos));
  }

  openModal(): void {
    this.isModalOpen = true;
    this.newTodo = {} as Todo;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  addTodo(event: Event): void {
    event.preventDefault();
    this.todoService.createTodo(this.newTodo).subscribe((todo: Todo) => {
      this.todos.push(todo);
      this.closeModal();
    });
  }

  deleteTodoById(id: number): void {
    this.todoService.deleteTodoById(id).subscribe(() => {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    });
  }

  get filteredTodos(): Todo[] {
    return this.todos.filter(
      (todo) => this.filterByPriority(todo) && this.filterByDescription(todo)
    );
  }

  filterByPriority(todo: Todo): boolean {
    if (this.priorityFilter === '') {
      return true;
    }

    return todo.priority === this.priorityFilter;
  }

  filterByDescription(todo: Todo): boolean {
    if (this.descriptionFilter === '') {
      return true;
    }

    const description = todo.description.toLowerCase();
    const filter = this.descriptionFilter.toLowerCase();

    return description.includes(filter);
  }
}
