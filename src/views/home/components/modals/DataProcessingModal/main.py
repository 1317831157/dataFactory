import tkinter as tk
from tkinter import ttk, messagebox
import os
import json
from datetime import datetime
from data_filter import DataFilter

class DataProcessor:
    def __init__(self):
        self.formula_data = []
        self.trash_data = []
        self.data_file = "data_storage.json"
        self.data_filter = DataFilter()
        self.load_data()

    def load_data(self):
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.formula_data = data.get('formula_data', [])
                self.trash_data = data.get('trash_data', [])

    def save_data(self):
        data = {
            'formula_data': self.formula_data,
            'trash_data': self.trash_data
        }
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

    def process_input(self, input_data: str):
        """处理输入数据"""
        classified = self.data_filter.classify_data([input_data])
        
        for item in classified['formulas']:
            self.add_formula(item['content'], item['type'])
        
        for item in classified['trash']:
            self.add_to_trash(item['content'])

    def add_formula(self, formula: str, data_type: str = 'normal'):
        self.formula_data.append({
            'content': formula,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'status': 'active',
            'type': data_type
        })
        self.save_data()

    def add_to_trash(self, content: str):
        self.trash_data.append({
            'content': content,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'status': 'trash'
        })
        self.save_data()

    def move_to_trash(self, index):
        if 0 <= index < len(self.formula_data):
            item = self.formula_data.pop(index)
            item['status'] = 'trash'
            self.trash_data.append(item)
            self.save_data()

    def restore_from_trash(self, index):
        if 0 <= index < len(self.trash_data):
            item = self.trash_data.pop(index)
            item['status'] = 'active'
            self.formula_data.append(item)
            self.save_data()

    def delete_permanently(self, index):
        if 0 <= index < len(self.trash_data):
            self.trash_data.pop(index)
            self.save_data()

class DataViewer:
    def __init__(self, processor):
        self.processor = processor
        self.window = tk.Tk()
        self.window.title("数据处理系统")
        self.window.geometry("800x600")
        
        self.create_widgets()
        
    def create_widgets(self):
        # 创建主框架
        main_frame = ttk.Frame(self.window)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # 创建输入区域
        input_frame = ttk.Frame(main_frame)
        input_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(input_frame, text="输入数据:").pack(side=tk.LEFT)
        self.input_entry = ttk.Entry(input_frame, width=50)
        self.input_entry.pack(side=tk.LEFT, padx=5)
        ttk.Button(input_frame, text="处理", command=self.process_input).pack(side=tk.LEFT)
        
        # 创建按钮
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(fill=tk.X, pady=5)
        
        ttk.Button(button_frame, text="查看公式数据", command=self.show_formula_data).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="查看垃圾数据", command=self.show_trash_data).pack(side=tk.LEFT, padx=5)
        
        # 创建数据显示区域
        self.data_text = tk.Text(main_frame, height=20, width=80)
        self.data_text.pack(pady=10)
        
        # 创建操作按钮
        self.action_frame = ttk.Frame(main_frame)
        self.action_frame.pack(fill=tk.X, pady=5)
        
    def process_input(self):
        input_data = self.input_entry.get().strip()
        if input_data:
            self.processor.process_input(input_data)
            self.input_entry.delete(0, tk.END)
            messagebox.showinfo("成功", "数据已处理")
        else:
            messagebox.showwarning("警告", "请输入数据")
            
    def show_formula_data(self):
        self.data_text.delete(1.0, tk.END)
        for i, item in enumerate(self.processor.formula_data):
            self.data_text.insert(tk.END, f"数据 {i+1}:\n")
            self.data_text.insert(tk.END, f"内容: {item['content']}\n")
            self.data_text.insert(tk.END, f"类型: {item['type']}\n")
            self.data_text.insert(tk.END, f"时间: {item['timestamp']}\n")
            self.data_text.insert(tk.END, f"状态: {item['status']}\n")
            self.data_text.insert(tk.END, "-" * 50 + "\n")
            
        # 显示操作按钮
        self.show_action_buttons('formula')
            
    def show_trash_data(self):
        self.data_text.delete(1.0, tk.END)
        for i, item in enumerate(self.processor.trash_data):
            self.data_text.insert(tk.END, f"垃圾数据 {i+1}:\n")
            self.data_text.insert(tk.END, f"内容: {item['content']}\n")
            self.data_text.insert(tk.END, f"时间: {item['timestamp']}\n")
            self.data_text.insert(tk.END, f"状态: {item['status']}\n")
            self.data_text.insert(tk.END, "-" * 50 + "\n")
            
        # 显示操作按钮
        self.show_action_buttons('trash')
        
    def show_action_buttons(self, data_type):
        # 清除现有按钮
        for widget in self.action_frame.winfo_children():
            widget.destroy()
            
        if data_type == 'formula':
            ttk.Button(self.action_frame, text="移动到垃圾箱", 
                      command=lambda: self.move_to_trash()).pack(side=tk.LEFT, padx=5)
        else:
            ttk.Button(self.action_frame, text="恢复", 
                      command=lambda: self.restore_from_trash()).pack(side=tk.LEFT, padx=5)
            ttk.Button(self.action_frame, text="永久删除", 
                      command=lambda: self.delete_permanently()).pack(side=tk.LEFT, padx=5)
            
    def move_to_trash(self):
        try:
            index = int(self.data_text.index(tk.INSERT).split('.')[0]) - 1
            self.processor.move_to_trash(index)
            self.show_formula_data()
            messagebox.showinfo("成功", "数据已移动到垃圾箱")
        except:
            messagebox.showerror("错误", "请选择要移动的数据")
            
    def restore_from_trash(self):
        try:
            index = int(self.data_text.index(tk.INSERT).split('.')[0]) - 1
            self.processor.restore_from_trash(index)
            self.show_trash_data()
            messagebox.showinfo("成功", "数据已恢复")
        except:
            messagebox.showerror("错误", "请选择要恢复的数据")
            
    def delete_permanently(self):
        try:
            index = int(self.data_text.index(tk.INSERT).split('.')[0]) - 1
            self.processor.delete_permanently(index)
            self.show_trash_data()
            messagebox.showinfo("成功", "数据已永久删除")
        except:
            messagebox.showerror("错误", "请选择要删除的数据")
            
    def run(self):
        self.window.mainloop()

if __name__ == "__main__":
    processor = DataProcessor()
    viewer = DataViewer(processor)
    viewer.run() 