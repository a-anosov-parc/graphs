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
			},
			classes: 'company menu'
		}, {
			data: {
				id: 'c',
				label: 'ОАО "Русатом"',
				parent: 'a'
			},
			classes: 'company menu'
		}, {
			data: {
				id: 'f',
				label: 'Петров Иван Иванович'
			},
			classes: 'person menu'
		}, {
			data: {
				id: 'fc',
				source: 'f',
				target: 'c',
				label: 'Руководитель'
			}
		}],
		style: [{
			selector: 'core',
			css: {
				'active-bg-size': 0
			}
		}, {
			selector: ':active',
			css: {
				'overlay-padding': 0,
				'overlay-opacity': 0
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
				'border-color': '#a2ccf2',
				'background-color': '#deefff',
				'background-image': 'company.png',
				'background-position-x': '-33px'
			}
		}, {
			selector: 'node.person',
			css: {
				'background-color': '#ffe596',
				'background-image': 'person.png',
				'background-position-x': '-28px'
			}
		}, {
			selector: 'node:active, node.active',
			css: {
				'border-width': 1
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
			selector: '$node:active > node, $node.active > node',
			css: {
				'border-width': 0
			}
		}, {
			selector: 'edge',
			css: {
				//'curve-style': 'segments',
				'line-style': 'dashed'
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

	window.cy.on('click', function () {
		window.cyClickTimeout = setTimeout(function () {
			window.cy.$('node').removeClass('active');
		}, 0);
	});

	window.cy.on('click', 'node', function (e) {
		var isActive = e.cyTarget.hasClass('active');

		window.cy.$('node').removeClass('active');
		clearTimeout(window.cyClickTimeout);
		e.cyTarget.toggleClass('active', !isActive);
	});

	window.cy.$('.menu').qtip({
		content: '&nbsp;',
		position: {
			my: 'top center',
			at: 'bottom right'
		},
		style: {
			classes: 'qtip-bootstrap',
			tip: {
				width: 13,
				height: 5
			}
		},
		events: {
			show: function (event, api) {
				setTimeout(function () {
					var $tip = $(event.currentTarget),
						ele = $tip.data('ele');

					if (ele) {
						$tip.find('.qtip-content').html(ele.data('label'));
					}
				}, 25);
			}
		}
	});
});
