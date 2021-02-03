const { expect } = require('chai');
const redis = require('../lib/redis');
const { register, list, remove } = require('./worker');

describe('worker', function () {
  this.timeout(99999);

  before(async function () {
    await redis.connect();
  });

  after(function () {
    redis.close();
  });

  beforeEach(async function () {
    await redis.drop('worker');
  });

  it('should register new worker', async function () {
    await register({
      name: 'budi',
      age: 12,
      bio: 'sendu melulu',
      address: 'dekat kamu',
      photo: 'dia.jpg',
    });
    const workers = await redis.read('worker');
    expect(workers).to.have.length(1);
    const w1 = workers[0];
    expect(w1).to.have.property('name', 'budi');
    expect(w1).to.have.property('age', 12);
    expect(w1).to.have.property('bio', 'sendu melulu');
    expect(w1).to.have.property('address', 'dekat kamu');
    expect(w1).to.have.property('photo', 'dia.jpg');
  });

  it('should display list of registered worker', async function () {
    const data = [
      {
        id: 1,
        name: 'budi',
        age: 12,
        bio: 'sendum melagu',
        address: 'dekat',
        photo: 'dia.jpg',
      },
      {
        id: 2,
        name: 'susi',
        age: 12,
        bio: '',
        address: 'jauh',
        photo: 'aku.jpg',
      },
    ];
    await redis.save('worker', data);
    const workers = await list();
    expect(workers).to.have.length(2);
    expect(workers).to.be.deep.eq(data);
  });

  it('should be able to remove workers', async function () {
    const data = [
      {
        id: 1,
        name: 'budi',
        age: 12,
        bio: 'sendum melagu',
        address: 'dekat',
        photo: 'dia.jpg',
      },
      {
        id: 2,
        name: 'susi',
        age: 12,
        bio: '',
        address: 'jauh',
        photo: 'aku.jpg',
      },
    ];
    await redis.save('worker', data);
    await remove(1);
    const workers = await redis.read('worker');
    expect(workers).to.have.length(1);
    expect(workers[0]).to.have.property('id', 2);
  });
});
