# Calendar++

> [!NOTE]
> This readme will be updated to show a real readme later in the project's life cycle


Welcome to our project!
Feel free to have a look around

# Installation

> [!NOTE]
> I am assuming you are using visual studio code.

1) Install [python 3.11](https://www.python.org/downloads/) and above. If you are on Linux or Mac I recomend using your package manager (apt or brew respectively)

2) Install [sqlite](https://www.sqlite.org/) (again, Mac and Linux, I recomend your package manager). This is our database that we will be using, it is extremely portable.

3) Next, `git clone` this repo and then open it in visual studio code.

4) Open a terminal in visual studio code and run the following command `python -m pip install -r requirements.txt`. This will install all of dependencies we will use for this project. Each time we add a new one, we will update  `requirements.txt`

5) To run our application, run `flask run` in your terminal. This will start an HTTP server that you can connect to you in your browser, it will show you the link in the terminal output. This server updates live when you make changes.

More instructions soon after we figure out database stuff.