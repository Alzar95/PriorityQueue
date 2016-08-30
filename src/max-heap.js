const Node = require('./node');

class MaxHeap {
	constructor() {
		this.root = null;
		this.parentNodes = [];
	}

	push(data, priority) {
		var node = new Node(data, priority);
		this.insertNode(node);
		this.shiftNodeUp(node);
	}

	pop() {
		if (this.root === null) {
			return null;
		}
		else {
			var dRoot = this.detachRoot();
			this.restoreRootFromLastInsertedNode(dRoot);
			this.shiftNodeDown(this.root);
			return dRoot.data;
		}
	}

	detachRoot() {
		var currentRoot = this.root;

		this.root = null;

		if (this.parentNodes[this.parentNodes.length - 2] === currentRoot) {
			this.parentNodes.shift();
		}

		return currentRoot;
	}

	restoreRootFromLastInsertedNode(detached) {
		if (!detached.data) {
			return null;
		}

		var last = this.parentNodes.pop();

		this.root = last;

		if (last === detached.left) {
			last.left = null;
			last.right = null;
		}
		else if (last === detached.right) {
			last.right = null;
			last.left = detached.left;
			last.left.parent = last;
		}

		this.parentNodes.unshift(last);
	}

	size() {
		function inOrder(node) {
			if (!node) {
				return 0;
			}
			else {
				var countLeft = (node.left && (node.left.data!=node.data))? inOrder(node.left) : 0;
				var countRight = (node.right && (node.right.data!=node.data))? inOrder(node.right) : 0;
				return  countLeft + countRight + 1;}
		}
		var count = inOrder(this.root);
		return count;
	}

	isEmpty() {
		return this.root === null;
	}

	clear() {
		this.root = null;
		this.parentNodes = [];
	}

	insertNode(node) {
		if (this.root === null) {
			this.root = node;
		}
		else {
			if(this.parentNodes[0].left === null){
				this.parentNodes[0].left = node;
				node.parent = this.parentNodes[0];

			} else if (this.parentNodes[0].right === null){
				this.parentNodes[0].right = node;
				node.parent = this.parentNodes[0];
				this.parentNodes.shift();

			}
		}
		this.parentNodes.push(node);
	}

	shiftNodeUp(node) {
		if (node.parent === null) {
			this.root = node;
			return;
		}
		if (node.priority > node.parent.priority) {
			var parentIndex = this.parentNodes.indexOf(node.parent);
			var nodeIndex = this.parentNodes.indexOf(node);

			if(parentIndex !== -1){
				this.parentNodes[parentIndex] = node;
			}

			if(nodeIndex !== -1){
				this.parentNodes[nodeIndex] = node.parent;
			}

			node.swapWithParent();
			this.shiftNodeUp(node);
		}
	}

	shiftNodeDown(node) {
		if (node.left === null && node.right === null) {
			return;
		}

		if (node.left !== null) {
			if (node.priority < node.left.priority && (node.right === null || node.left.priority > node.right.priority)) {
				var childIndexL = this.parentNodes.indexOf(node.left);
				var nodeIndexL = this.parentNodes.indexOf(node);

				if (this.root === node) {
					this.root = node.left;
				}

				if (childIndexL !== -1) {
					this.parentNodes[childIndexL] = node;
				}

				if (nodeIndexL !== -1) {
					this.parentNodes[nodeIndexL] = node.left;
				}

				node.left.swapWithParent();

				this.shiftNodeDown(node);
			}
		}
		else if (node.right !== null) {
			if (node.priority < node.right.priority && (node.left === null || node.left.priority < node.right.priority)) {
				var childIndexR = this.parentNodes.indexOf(node.right);
				var nodeIndexR = this.parentNodes.indexOf(node);

				if (this.root === node) {
					this.root = node.right;
				}


				if (childIndexR !== -1) {
					this.parentNodes[childIndexR] = node;
				}

				if (nodeIndexR !== -1) {
					this.parentNodes[nodeIndexR] = node.right;
				}

				node.right.swapWithParent();

				this.shiftNodeDown(node);
			}
		}
	}
}

module.exports = MaxHeap;
