/*global cytoscape:false */
'use strict';

$(function () {
	window.cy = cytoscape({
		container: $('#cy'),

		elements: [{
			data: {
				id: 'a',
				isCompounded: true,
				label: 'Москва'
			}
		}, {
			data: {
				id: 'b',
				label: 'ОАО "Терем"',
				parent: 'a'
			}
		}, {
			data: {
				id: 'c',
				label: 'ОАО "Русатом"',
				parent: 'a'
			}
		}, {
			data: {
				id: 'f',
				label: 'Петров Иван Иванович'
			},
			classes: 'person'
		}, {
			data: {
				id: 'fc',
				source: 'f',
				target: 'c'
			}
		}],
		style: [{
			selector: 'core',
			css: {
				'active-bg-size': 0
			}
		}, {
			selector: 'node',
			css: {
				'width': 'label',
				'height': 32,
				'shape': 'roundrectangle',
				'content': 'data(label)',
				'padding-left': '48px',
				'padding-right': '48px',
				'font-size': 12,
				'font-weight': 'bold',
				'font-family': 'Arial, Helvetica, sans-serif',
				'text-valign': 'center',
				'text-halign': 'center',
				'background-color': '#deefff',
				'background-image': '/company.png',
				'background-position-x': '-33px'
			}
		}, {
			selector: 'node.person',
			css: {
				'background-color': '#ffe596',
				'background-image': '/person.png',
				'background-position-x': '-28px'
			}
		}, {
			selector: '$node > node',
			css: {
				'padding-left': '8px',
				'padding-right': '8px',
				'padding-top': '8px',
				'padding-bottom': '8px',
				'font-size': 14,
				'text-valign': 'top',
				'background-color': '#f8f8fa',
				'background-image': 'none'
			}
		}, {
			selector: 'edge',
			css: {
				//'curve-style': 'segments',
				'line-style': 'dashed',
				//'target-arrow-shape': 'triangle'
			}
		}],
		layout: {
			name: 'cose-bilkent',
			fit: false,
			padding: 16,
			stop: function () {
				window.cy.center();

				setTimeout(function () {
					$('#cy').removeClass('g-invisible');
				}, 100);
			}
		},
		//minZoom: 0.5,
		//maxZoom: 1,
		userZoomingEnabled: false
	});

	window.cy.$('#f').qtip({
		content: '<h3>Hello!</h3>',
		position: {
			my: 'top center',
			at: 'bottom right'
		},
		style: {
			classes: 'qtip-bootstrap',
			tip: {
				width: 16,
				height: 8
			}
		}
	});
});
