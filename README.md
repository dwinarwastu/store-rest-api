## Installation

1. Clone the repository

```bash
git clone https://github.com/dwinarwastu/store-rest-api.git
cd store-rest-api
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables

```
# DATABASE
MONGO_URI = "mongodb://localhost:27017/store"

# PORT
PORT =

# JWT TOKEN
JWT_SECRET =
ACCESS_TOKEN =
REFRESH_TOKEN =
```

4. Run the server

```bash
npm run dev
```
