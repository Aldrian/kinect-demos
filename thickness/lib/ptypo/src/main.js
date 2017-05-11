Ptypo.createFont('anrt-font', 'anrt').then( function() {
	document.getElementById('chargement').style.display = 'none';
	[
		'thickness',
		'width',
		'xHeight',
		'capDelta',
		'descender',
		'ascender',
		'_contrast',
		'baseLine',
	].forEach(function(id) {
		const el = document.getElementById(id);
		el.addEventListener('input', function() {
			Ptypo.changeParam(parseFloat(el.value), id, 'anrt-font');
		});
	});

});

