import { assert } from 'chai';
import { describe, it } from 'mocha';

import { Node, PathDirection, MergeFunction } from '../../src/merkle/merkle';
import { MerkleTree } from '../../src/merkle/merkle-tree';

class StringConcat implements MergeFunction<string> {
  async merge(n1: Node<string>, n2: Node<string>): Promise<Node<string>> {
    return new Node(`Hash(${n1} + ${n2})`);
  }
}

describe('Merkle tree direct path tests', async () => {
  it('should handle the case: [A]', async () => {
    const leaves = ['A'];
    const merkleTree = new MerkleTree<string>(new StringConcat());
    await merkleTree.build(leaves);

    const directPath = await merkleTree.getDirectPathFromRoot(0);
    assert.deepEqual(directPath, []);
  });

  it('should handle the case: [A]', async () => {
    const leaves = ['A', 'B', 'C', 'D'];
    const merkleTree = new MerkleTree<string>(new StringConcat());
    await merkleTree.build(leaves);

    const directPath = await merkleTree.getDirectPathFromRoot(0);
    assert.deepEqual(directPath, [PathDirection.L, PathDirection.L]);
  });

  it('should handle the case: [A]', async () => {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const merkleTree = new MerkleTree<string>(new StringConcat());
    await merkleTree.build(leaves);

    const directPath = await merkleTree.getDirectPathFromRoot(0);
    assert.deepEqual(directPath, [PathDirection.L, PathDirection.L, PathDirection.L]);
  });

  it('should handle the case: [B]', async () => {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const merkleTree = new MerkleTree<string>(new StringConcat());
    await merkleTree.build(leaves);

    const directPath = await merkleTree.getDirectPathFromRoot(1);
    assert.deepEqual(directPath, [PathDirection.L, PathDirection.L, PathDirection.R]);
  });

  it('should handle the case: [H]', async () => {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const merkleTree = new MerkleTree<string>(new StringConcat());
    await merkleTree.build(leaves);

    const directPath = await merkleTree.getDirectPathFromRoot(7);
    assert.deepEqual(directPath, [PathDirection.R, PathDirection.R, PathDirection.R]);
  });

  it('should handle the case: [G]', async () => {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const merkleTree = new MerkleTree<string>(new StringConcat());
    await merkleTree.build(leaves);

    const directPath = await merkleTree.getDirectPathFromRoot(6);
    assert.deepEqual(directPath, [PathDirection.R, PathDirection.R, PathDirection.L]);
  });

  it('should handle the case: [J]', async () => {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
    const merkleTree = new MerkleTree<string>(new StringConcat());
    await merkleTree.build(leaves);

    const directPath = await merkleTree.getDirectPathFromRoot(8);
    assert.deepEqual(directPath, [PathDirection.R]);
  });
});