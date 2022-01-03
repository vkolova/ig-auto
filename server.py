# import os

# from sanic import Sanic
# from sanic.response import text

# app = Sanic('ig-auto-app')

# @app.get('/')
# async def hello_world(request):
#     return text('Hello, world.')

# if __name__ == '__main__':
#     app.run(
#         host='0.0.0.0',
#         port=int(os.environ.get('PORT', 8000)),
#         workers=int(os.environ.get('WEB_CONCURRENCY', 1)),
#         debug=bool(os.environ.get('DEBUG', ''))
#     )



from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"