const subject = require('../../src/filter-packages');

describe('src/filter-packages', () => {
	const manifests = [
		{
			name: 'foo',
			private: true
		},
		{
			name: 'bar',
			author: 'Joe Bloggs'
		},
		{
			name: 'baz',
			private: false
		}
	];

	const fixture = manifests.map((manifest) => ({ manifest }));

	it('matches manifests with a matching field and value', () => {
		const result = subject('private:false', fixture);

		expect(result.length).toEqual(1);
		expect(result[0].manifest.name).toEqual('baz');
	});

	it('coerces different types of value', () => {
		const a = subject('private:true', fixture);

		expect(a.length).toEqual(1);
		expect(a[0].manifest.name).toEqual('foo');

		const b = subject('author:"Joe Bloggs"', fixture);

		expect(b.length).toEqual(1);
		expect(b[0].manifest.name).toEqual('bar');
	});

	it('defaults to matching the package name', () => {
		const result = subject('baz', fixture);

		expect(result.length).toEqual(1);
		expect(result[0].manifest.name).toEqual('baz');
	});
});
