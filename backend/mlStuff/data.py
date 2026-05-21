import requests
import zipfile
import os
import pandas as pd

def read_data():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    zip_path = os.path.join(script_dir, 'chords.zip')
    
    with zipfile.ZipFile(zip_path, 'r') as archive:
        with archive.open('chords.txt') as file:
            for line in file:
                yield line.decode('utf-8')

def format_data():
    temp_list = {}
    temp_list["chords"] = []
    count = 0
    for line in read_data():
        temp_list["chords"].append(line.lstrip().replace(" ", "-").replace("\n","").replace("\r", "").split("-"))
        count += 1
        if count > 30_000:
            break
    temp_df = pd.DataFrame(temp_list)
    temp_df.to_csv("data.csv")

if __name__ == "__main__":
    format_data()