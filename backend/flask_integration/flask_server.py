from flask import Flask, request, jsonify

app = Flask(__name__)

# Route to handle incoming requests
@app.route('/data', methods=['POST'])
def receive_data():
    # Extract JSON data from the request
    data = request.json

    # Process the received data (e.g., save to a database)
    # Here, we simply print the received data
    print("Received data:", data)

    # Prepare a response
    response = {'message': 'Data received successfully'}

    # Return a JSON response
    return jsonify(response)

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000)