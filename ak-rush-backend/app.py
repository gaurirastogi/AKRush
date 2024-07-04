from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import json

app = Flask(__name__)
CORS(app)

CSV_FILE = './data/rushees.csv'

def parse_comments(comments_str):
    try:
        return json.loads(comments_str.replace("'", '"'))
    except json.JSONDecodeError:
        return {}

@app.route('/api/rushees', methods=['GET'])
def get_rushees():
    rushees = []
    with open(CSV_FILE, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            row['comments'] = parse_comments(row['comments'])
            rushees.append(row)
    return jsonify(rushees)

@app.route('/api/rushees/<rushee_id>', methods=['GET'])
def get_rushee_details(rushee_id):
    with open(CSV_FILE, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            if row['id'] == rushee_id:
                row['comments'] = parse_comments(row['comments'])
                return jsonify(row)
    return jsonify({'error': 'Rushee not found'}), 404

@app.route('/api/rushees/<rushee_id>/comments', methods=['POST'])
def add_comment(rushee_id):
    comment_data = request.json
    updated = False
    with open(CSV_FILE, 'r') as file:
        csv_reader = csv.DictReader(file)
        rushees = [row for row in csv_reader]

    with open(CSV_FILE, 'w', newline='') as file:
        fieldnames = ['id', 'name', 'major', 'photo', 'comments']
        csv_writer = csv.DictWriter(file, fieldnames=fieldnames)
        csv_writer.writeheader()
        for rushee in rushees:
            if rushee['id'] == rushee_id:
                comments = parse_comments(rushee['comments'])
                for key, value in comment_data.items():
                    if key in comments:
                        comments[key] = comments[key] + " | " + value if comments[key] else value
                    else:
                        comments[key] = value
                rushee['comments'] = json.dumps(comments)
                updated = True
            csv_writer.writerow(rushee)

    return jsonify({'success': True}) if updated else jsonify({'error': 'Rushee not found'}), 404

@app.route('/api/rushees/<rushee_id>/comments/<comment_type>/<int:index>', methods=['PUT', 'DELETE', 'GET'])
def modify_comment(rushee_id, comment_type, index):
    with open(CSV_FILE, 'r') as file:
        csv_reader = csv.DictReader(file)
        rushees = [row for row in csv_reader]

    updated = False
    with open(CSV_FILE, 'w', newline='') as file:
        fieldnames = ['id', 'name', 'major', 'photo', 'comments']
        csv_writer = csv.DictWriter(file, fieldnames=fieldnames)
        csv_writer.writeheader()
        for rushee in rushees:
            if rushee['id'] == rushee_id:
                comments = parse_comments(rushee['comments'])
                comment_list = comments.get(comment_type, "").split(" | ")
                if 0 <= index < len(comment_list):
                    if request.method == 'PUT':
                        comment_list[index] = request.json.get('comment', comment_list[index])
                    elif request.method == 'DELETE':
                        comment_list.pop(index)
                    comments[comment_type] = " | ".join(comment_list).strip(" | ")
                    rushee['comments'] = json.dumps(comments)
                    updated = True
            csv_writer.writerow(rushee)

    return jsonify({'success': True}) if updated else jsonify({'error': 'Comment or rushee not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)