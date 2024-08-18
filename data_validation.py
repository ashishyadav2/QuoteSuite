import json
import re
from datetime import datetime
import time

class DataValidation:
    def __init__(self,data_dict) -> None:
        self.data_dict = data_dict
        
    def validate_date(self):
        pattern  = r"([0-9]{2}|[0-9]{1})-([a-zA-Z]{3}|[a-zA-Z]{4})-([0-9]{4})"
        try:
            top_date = self.data_dict['date']['created']
        except KeyError:
            return False
        
        try:
            extracted_top_date = re.findall(pattern,top_date)[0]
        except IndexError:
            return False
        
        if len(extracted_top_date)!=3:
            return False
        
        months_mapping = { "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, "jul": 7, "aug": 8, "sept": 9, "oct": 10, "nov": 11, "dec": 12 }
        
        day = extracted_top_date[0]
        month = months_mapping[extracted_top_date[1].lower()]
        year = extracted_top_date[2]
        
        
        date = f"{day}/{month}/{year}"
        lower_date_limit =  f"1/1/1994"
        current_time = datetime.now()
        current_day = current_time.day
        current_month = current_time.month
        current_year = current_time.year
        upper_date_limit = f"{current_day}/{current_month}/{current_year}"
        
        try:
            date = time.strptime(date,"%d/%m/%Y")
            lower_date_limit = time.strptime(lower_date_limit,"%d/%m/%Y")
            upper_date_limit = time.strptime(upper_date_limit,"%d/%m/%Y")
        except ValueError:
            return False
        
        if not (lower_date_limit <= date <= upper_date_limit):
            return False
        if len(day)<2:
            day = "0"+str(day)
        # self.data_dict['date']['created'] = f"{day}-{extracted_top_date[1].title()}-{year}"
        self.data_dict['date']['created'] = datetime(int(year),int(month),int(day))
        modified_date = self.data_dict['date']['modified'].split("-")
        modified_year = int(modified_date[2])
        modified_month = months_mapping[modified_date[1].lower()]
        modified_day = int(modified_date[0])
        self.data_dict['date']['modified'] = datetime(modified_year,modified_month,modified_day)
        return True
        
    def validate_client_name_and_desc(self):
        try:
            client_name = self.data_dict['client_name']
            client_description = self.data_dict['client_description']
        except KeyError:
            return False
        client_name_len = len(client_name)
        if not (2<=client_name_len<=35):
            return False
        self.data_dict['client_name'] = " ".join([ch.title() for ch in self.data_dict['client_name'].split(" ")])
        self.data_dict['client_description'] = self.data_dict['client_description'].title()
        return True  
        
    def is_valid(self):
        return (
            self.validate_date() and 
            self.validate_client_name_and_desc()
        )        
        
    
    def get_data_dict(self):
        if self.is_valid():
            return self.data_dict
        return None
    
    
# if __name__ == "__main__":
#     data = {'file_path': '22-nov-2002-some tabular data.ash', 'client_name': 'as hish yadav', 'client_description': 'Ashish Yadav', 'q_description': [{'product': 'some tabular data', 'qty': 1, 'rate': 1, 'amount': 101900}, {'product': 'some tabular data', 'qty': 1, 'rate': 1, 'amount': 100910}, {'product': 'some tabular data', 'qty': 1, 'rate': 1, 'amount': 100300}, {'product': 'some tabular data', 'qty': 1, 'rate': 1, 'amount': 105000}, {'product': 'some tabular data', 'qty': 1, 'rate': 1, 'amount': 500000}, {'product': 'some tabular data', 'qty': 1, 'rate': 1, 'amount': 100000}, {'product': 'some tabular data', 'qty': 1, 'rate': 1, 'amount': 100600}, {'product': 'some tabular data', 'qty': 1, 'rate': 1, 'amount': 106500}, {'product': 'some tabular data', 'qty': 1, 'rate': 1, 'amount': 190000}], 'date': {'created': '22-noV-2002', 'modified': '15-noV-2023'}, 'total': 1405210}
    
#     obj = DataValidation(data)
#     print(obj.get_data_dict())
#     # print(obj.validate_date())
#     # print(obj.validate_client_name())
    
    