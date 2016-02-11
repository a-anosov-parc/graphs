/*global cytoscape:false, amplify:false */
'use strict';

$(function () {
	var //startCompanyId = 815363,		// Газпром
		//startCompanyId = 1115469,		// Роснефть
		//startCompanyId = 791795,		// Стройполимер
		startCompanyId = 11284307,	// Право.ру
		deferred = new $.Deferred();

	if (!amplify.store('nodes')) {
		$.ajax({
				type: 'post',
				contentType: 'application/json',
				url: 'http://cg-gdbtest:2480/command/Affiliation/sql/-/1000?format=rid,type,version,class,graph',
				headers: {
					Authorization: 'Basic YWRtaW46YWRtaW4='
				},
				data: 'select *, in.*, out.* from (select expand(bothE()) from Organization where VersionId = ' +
					  startCompanyId + ')'
		}).then(function (edges) {
			deferred.resolve(edges);
		}, function () {
			deferred.reject();
		});
	} else {
		deferred.resolve();
	}

	deferred.then(function (edges) {
		if (!amplify.store('edges')) {
			amplify.store('edges', JSON.stringify(edges));
		} else {
			edges = JSON.parse(amplify.store('edges'));
		}

		edges = edges.result;

		// Get cities
		var index,
			elements = [],
			cities = [],
			region;

		for (index = 0; index < edges.length; index++) {
			if (edges[index].inRegion && ($.inArray(edges[index].inRegion, cities) === -1)) {
				cities.push(edges[index].inRegion);
			}

			if (edges[index].outRegion && ($.inArray(edges[index].outRegion, cities) === -1)) {
				cities.push(edges[index].outRegion);
			}
		}

		for (index = 0; index < cities.length; index++) {
			elements.push({
				data: {
					id: cities[index],
					isCompounded: true,
					label: cities[index]
				}
			});
		}

		var nodes = [],
			ribs = [],
			ribId,
			key,
			match;

		for (index = 0; index < edges.length; index++) {
			ribId = edges[index]['in'] + '-' + edges[index].out;

			if (!nodes[edges[index]['in']]) {
				nodes[edges[index]['in']] = {};
			}

			if (!nodes[edges[index].out]) {
				nodes[edges[index].out] = {};
			}

			if (!ribs[ribId]) {
				ribs[ribId] = {
					id: ribId,
					source: edges[index]['in'],
					target: edges[index].out,
					label: edges[index]['@class']
				};
			}

			for (key in edges[index]) {
				if (edges[index].hasOwnProperty(key)) {
					match = key.match(/^(in|out)(\w+)$/);

					if (match) {
						nodes[edges[index][match[1]]][match[2]] = edges[index][key];
					}
				}
			}
		}

		var organizationName,
			personName;

		for (index in nodes) {
			if (nodes.hasOwnProperty(index)) {
				organizationName = nodes[index].ShortName || nodes[index].Name;
				personName = [(nodes[index].LastName || ''), (nodes[index].FirstName || ''),
							  (nodes[index].MiddleName || '')].join(' ');

				elements.push({
					data: {
						id: index,
						label: organizationName || personName,
						parent: nodes[index].Region
					},
					classes: (organizationName ? 'company' : 'person') + ' menu'
				});
			}
		}

		for (index in ribs) {
			if (ribs.hasOwnProperty(index)) {
				elements.push({
					data: ribs[index]
				});
			}
		}

		/*var randomInteger = function (min, max) {
				return Math.round(min - 0.5 + Math.random() * (max - min + 1));
			},
			nodesSizes = [];

		for (var i = 0; i < 5; i++) {
			nodesSizes.push(randomInteger(32, 64));
		}*/

		window.cy = cytoscape({
			container: $('#cy'),
			elements: elements,
			/*elements: [{
				data: {
					id: 'moscow',
					isCompounded: true,
					label: 'Москва'
				}
			}, {
				data: {
					id: 'samara',
					isCompounded: true,
					label: 'Самара'
				}
			}, {
				data: {
					id: '1',
					label: 'ОАО "Терем"',
					parent: 'moscow'
				},
				position: { x: 400, y: 400 },
				classes: 'node1 company menu'
			}, {
				data: {
					id: '2',
					label: 'ОАО "Газпром"',
					parent: 'moscow'
				},
				position: { x: 300, y: 350 },
				classes: 'node2 company menu'
			}, {
				data: {
					id: '3',
					label: 'Петров Иван Иванович',
					parent: 'moscow'
				},
				position: { x: 100, y: 300 },
				classes: 'node3 person menu'
			}, {
				data: {
					id: '4',
					label: 'ОАО "Русатом"',
					parent: 'samara'
				},
				position: { x: 500, y: 100 },
				classes: 'node4 company menu'
			}, {
				data: {
					id: '5',
					label: 'ОАО "БМВ Русланд"',
					parent: 'samara'
				},
				position: { x: 250, y: 50 },
				classes: 'node5 company menu'
			}, {
				data: {
					id: '1-4',
					source: '1',
					target: '4',
					label: 'Адвокат'
				},
				classes: 'dashed'
			}, {
				data: {
					id: '4-5',
					source: '4',
					target: '5',
					label: 'Арбитражные дела • 50'
				}
			}, {
				data: {
					id: '3-5',
					source: '3',
					target: '5',
					label: 'Руководитель'
				}
			}, {
				data: {
					id: '2-3',
					source: '2',
					target: '3',
					label: 'Учредитель'
				},
				classes: 'dashed'
			}],*/

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
					'width': 200,
					'height': 80,
					'shape': 'circle',
					'content': 'data(label)',
					//'padding-left': '48px',
					//'padding-right': '48px',
					'font-size': 12,
					'font-weight': 'bold',
					'font-family': 'Arial, Helvetica, sans-serif',
					'text-valign': 'bottom',
					'text-halign': 'center',
					'text-wrap': 'wrap',
					'text-max-width': '200px',
					'border-color': '#deefff',
					'border-width': 1,
					'background-color': '#deefff',
					'background-fit': 'cover',
					'background-position-x': '50%',
					'background-position-y': '50%',
					'background-image': 'company.png'
					//'background-position-x': '-33px'
				}
			}, {
				selector: 'node.person',
				css: {
					'background-color': '#ffe596',
					'background-image': 'person.png'
					//'background-position-x': '-28px'
				}
			}, /*{
				selector: 'node.node1',
				css: {
					'width': nodesSizes[0],
					'height': nodesSizes[0]
				}
			}, {
				selector: 'node.node2',
				css: {
					'width': nodesSizes[1],
					'height': nodesSizes[1]
				}
			}, {
				selector: 'node.node3',
				css: {
					'width': nodesSizes[2],
					'height': nodesSizes[2]
				}
			}, {
				selector: 'node.node4',
				css: {
					'width': nodesSizes[3],
					'height': nodesSizes[3]
				}
			}, {
				selector: 'node.node5',
				css: {
					'width': nodesSizes[4],
					'height': nodesSizes[4]
				}
			},*/ {
				selector: 'node:active, node.active',
				css: {
					'border-color': '#a2ccf2'
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
					'border-width': 0,
					'background-color': '#f8f8fa',
					'background-image': 'none'
				}
			}, /*{
				selector: '$node:active > node, $node.active > node',
				css: {
					'border-width': 0
				}
			}, */{
				selector: 'edge',
				css: {
					'label': 'data(label)',
					'target-arrow-shape': 'triangle',
					'color': '#8d94a0',
					'line-color': '#8d94a0',
					'font-size': 12,
					'edge-text-rotation': 'autorotate'
				}
			}, {
				selector: 'edge.dashed',
				css: {
					'line-style': 'dashed'
				}
			}],
			layout: {
				name: 'cose-bilkent',
				//name: 'preset',
				fit: true,
				padding: 16,
				//randomize: true,
				//nodeRepulsion: 1000,
				//idealEdgeLength: 1000,
				animate: false,
				stop: function () {
					if (window.cy.center) {
						window.cy.center();
					}

					if (window.cy) {
						var index,
							nodes = window.cy.elements('node');

						for (index = 0; index < nodes.length; index++) {
							nodes[index].style('width', 32);
							nodes[index].style('height', 32);
						}
					}

					setTimeout(function () {
						$('#cy').removeClass('g-invisible');
					}, 100);
				}
			},
			minZoom: 0.8,
			maxZoom: 1,
			boxSelectionEnabled: true
			//userZoomingEnabled: false
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
				at: 'bottom center'
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
});
