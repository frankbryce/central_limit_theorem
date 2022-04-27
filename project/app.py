from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json
import numpy as np
import distribution

app = Flask(__name__)
app.config['SECRET_KEY'] = 'TODO - wtf is this?'
socketio = SocketIO(app)

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def jsEnc(data):
    return json.dumps(data, cls=NpEncoder)


@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('get')
def onrandom(p, ndist, ngets):
    sums = distribution.make(distribution.flip_coin(p),ndist,ngets)
    emit('json', {
        'sums': jsEnc(sums),
        'p': jsEnc(p),
        'ndist': jsEnc(ndist),
        'ngets': jsEnc(ngets),
    })

@socketio.on('connect')
def onconnect():
    print('client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('client disconnected')

if __name__ == '__main__':
    app.run(debug=True)
