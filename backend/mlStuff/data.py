import requests
import zipfile
import os
import pandas as pd
import markovify
import pickle
import random

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
        if count_line > 1000:
            break
    return " ".join(new_list)

def make_markov_model():
    random.seed() 
    the_text = make_sentences()
    model = markovify.Text(the_text)
    chords = model.make_sentence(test_output=False, tries=1000)
    print(chords)

if __name__ == "__main__":
    make_markov_model()