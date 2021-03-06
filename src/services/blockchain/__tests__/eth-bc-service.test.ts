import CID from 'cids';
import Ganache from 'ganache-core'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { config } from 'node-config-ts';

import Context from "../../../context";
import { BlockchainService } from "../blockchain-service";
import { Logger as logger } from '@overnightjs/logger/lib/Logger';

let ctx: Context = null;
let ganacheServer: any = null;
let ethBc: BlockchainService = null;

describe('ETH service',  () => {
  beforeAll(async (done) => {
    ctx = new Context();

    await ctx.build('services');
    ethBc = ctx.getSelectedBlockchainService();

    ganacheServer = Ganache.server({
      gasLimit: 7000000,
      time: new Date(1586784002855),
      mnemonic: 'move sense much taxi wave hurry recall stairs thank brother nut woman',
      // eslint-disable-next-line @typescript-eslint/camelcase
      default_balance_ether: 100,
      debug: true,
      blockTime: 2,
      // eslint-disable-next-line @typescript-eslint/camelcase
      network_id: 5777,
    });

    const localPort = config.blockchain.connectors.ethereum.rpc.port;
    ganacheServer.listen(localPort, async (err: Error) => {
      if (err) {
        throw new Error(`Failed to start local blockchain on port ${localPort}`);
      }
      logger.Imp(`Local Ethereum blockchain is up at http://localhost:${localPort}/`);
      done();
    });
  });

  test('should connect to local ganache server', async () => {
    try {
      await ethBc.connect();
    } catch (err) {
      expect(false).toBe(true);
    }
  });

  test('should send CID to local ganache server', async () => {
    try {
      const cid = new CID('bafyreic5p7grucmzx363ayxgoywb6d4qf5zjxgbqjixpkokbf5jtmdj5ni');
      const tx = await ethBc.sendTransaction(cid);
      expect(tx).toBeDefined();
      expect(tx).toMatchSnapshot();
    } catch (err) {
      expect(false).toBe(true);
    }
  });

  afterAll(async (done) => {
    logger.Imp(`Closing local Ethereum blockchain instance...`);
    ganacheServer.close();
    done();
  });

});
