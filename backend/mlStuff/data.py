import requests
import zipfile
import os
import pandas as pd
import markovify
import pickle
import random
from chordparser import Parser

def read_data():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    zip_path = os.path.join(script_dir, 'chords.zip')
    
    with zipfile.ZipFile(zip_path, 'r') as archive:
        with archive.open('chords.txt') as file:
            for line in file:
                yield line.decode('utf-8') + "." # period is so the markov libary can understand what is going on

def make_sentences():
    new_list = []
    count_line = 0
    for line in read_data():
        new_list.append(line)
        count_line += 1
        if count_line > 5_000:
            break
        print(line)
    return " ".join(new_list)

def make_model():
    the_text = make_sentences()
    model = markovify.Text(the_text)
    with open("model.pth", "wb") as file:
        pickle.dump(model, file)

def make_markov_sentences(chord_length:int=8) -> str:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'model.pth')
    random.seed() 
    with open(model_path, "rb") as file:
        model:markovify.Text = pickle.load(file)
    print("model loaded")
    chords = None
    while chords == None:
        chords = model.make_sentence(test_output=False, tries=1000)
    parsed_progressions = chords.split(" . ")
    choosen = random.choice(parsed_progressions).split()
    choosen = choosen[:chord_length]
    try:
        choosen.remove(".")
        return "-".join(choosen)
    except ValueError:
        return "-".join(choosen)
    
if __name__ == "__main__":
    print(make_markov_sentences())