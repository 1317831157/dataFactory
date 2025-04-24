import re
from typing import List, Dict, Any

class DataFilter:
    def __init__(self):
        self.formula_pattern = re.compile(r'^[A-Za-z0-9+\-*/=()\s]+$')
        self.trash_patterns = [
            re.compile(r'^\s*$'),  # 空行
            re.compile(r'^[^A-Za-z0-9]+$'),  # 纯符号
            re.compile(r'^[0-9\s]+$'),  # 纯数字
        ]
    
    def is_formula(self, text: str) -> bool:
        """判断是否为公式"""
        return bool(self.formula_pattern.match(text))
    
    def is_trash(self, text: str) -> bool:
        """判断是否为垃圾数据"""
        return any(pattern.match(text) for pattern in self.trash_patterns)
    
    def classify_data(self, data: List[str]) -> Dict[str, List[Dict[str, Any]]]:
        """分类数据"""
        result = {
            'formulas': [],
            'trash': []
        }
        
        for item in data:
            if self.is_formula(item):
                result['formulas'].append({
                    'content': item,
                    'type': 'formula'
                })
            elif self.is_trash(item):
                result['trash'].append({
                    'content': item,
                    'type': 'trash'
                })
            else:
                # 如果既不是公式也不是垃圾，则作为普通数据存储
                result['formulas'].append({
                    'content': item,
                    'type': 'normal'
                })
        
        return result 