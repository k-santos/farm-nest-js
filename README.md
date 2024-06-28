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

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/0d287ca3-bbde-4f0f-94c6-c050588e1402)


<h3>Adding an Animal to this lot</h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/eca8205b-61fb-4d92-8b36-76b61afe7d2b)


<h3> Trying to create another LOT with same name</h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/80ebb6fa-ab67-4f84-8324-5d02edbbd957)


<h3>Creating another LOT</h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/9525350b-7282-42de-b8ea-e802942b1eb7)


<h3>Deleting an animal</h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/5206660b-b027-4aab-950a-e6e2a99223a4)


<h3>Deleting a lot </h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/f964296d-8e66-45b0-929e-c82d4f047213)


<h3>List lots by name </h3>

![image](https://github.com/k-santos/farm-nest-js/assets/143345722/e3da9ac0-357f-4562-b1b9-b78f7c96d86e)

