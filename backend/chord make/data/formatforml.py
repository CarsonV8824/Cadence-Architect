import pandas as pd
import os
import ast
import json

def format_for_ml():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'data.csv')
    data = pd.read_csv(csv_path)
    work_with = data["chords"].apply(ast.literal_eval).tolist()
    count = 0
    for progression in work_with:
        count += 1
        if count > 2_000:
            break
        for i in range(len(progression)):
            try:
                yield progression[i+3], progression[i:i+3]
                # if want different sizes of input
                # yield progression[i+3], progression[:i+3]
            except Exception:
                break

def to_csv():
    x_values, y_values = zip(*format_for_ml())
    
    df = pd.DataFrame({
        'x_values': y_values,
        'y_values': x_values
    })
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, 'formatted_data.csv')
    df.to_csv(output_path, index=False)
    print(f"Data saved to {output_path}")
    print(f"Total samples: {len(df)}")
        
if __name__ == "__main__":
    to_csv()