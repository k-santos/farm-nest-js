<h1>Overview</h1>

<p> This project serves as a Backend For Frontend (BFF) application designed to manage lots and animals within each lot. It leverages Redis for caching queries to optimize performance. Built using Node.js and NestJS with TypeScript. </p>

<h1>Running the app</h1>
Before running the app, you should create a .env file based on the .env.example file. Also, take a look at the docker-compose.yaml file to check configurations.
<pre><code>
docker compose up -d
npm install
npm run start:dev
</code></pre>

<h1>Running the tests</h1>
<pre><code>
npm run tests
</code></pre>
<h2> Tests <h2>

<h3>Creating a LOT</h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/32fa0b95-d5bb-46fc-b141-e56baefb463a)

<h3>Adding an Animal to this lot</h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/6b353a2c-0bae-4075-9ef4-9aed7d0d2030)

<h3> Trying to create another LOT with same name</h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/9b355317-53d4-4584-b8ca-8c300024c6a1)

<h3>Creating another LOT</h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/fdee3042-1a42-42e9-bda4-a3f1fc943b6e)

<h3>Deleting an animal</h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/5b81f5e7-0caf-463d-892f-55d39d48c3c4)

<h3>Deleting a lot </h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/c647e1ab-762c-40cb-b9a7-10cf7e015d64)

<h3>List lots by name </h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/5bcb1bd4-9f7e-4e38-bdb3-b778c1883da0)
