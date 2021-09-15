module.exports = {
  setupQueue: queue => {
    queue.on('job succeeded', jobId => {
      console.log(`QUEUE ${queue.name}: JOB ${jobId} - SUCCESS\n`);
    });

    queue.on('job retrying', (jobId, error) => {
      console.error(`QUEUE ${queue.name}: JOB ${jobId} - RETRYING\n`, error);
    });

    queue.on('job failed', (jobId, error) => {
      console.log(`QUEUE ${queue.name}: JOB ${jobId} - FAILED\n`, error);
    });

    queue.on('error', err => {
      console.error(`QUEUE ${queue.name} - ERROR\n`, err);
    });
  }
};
