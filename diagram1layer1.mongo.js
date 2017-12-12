db.diagrams.replaceOne({ id: 2 },
{
	id: 2,
	elements: [
		{
			type: "LAYER",
			x: 0,
			y: 0,
			z: -1000,
			width: 500,
			height: 600
		},
		{
			type: "LIFELINE",
			source_x: -100,
			source_y: 250,
			source_z: -1000,
			length: 500
		},
		{
			type: "LIFELINE",
			source_x: 100,
			source_y: 250,
			source_z: -1000,
			length: 500
		},
		{
			type: "MESSAGE",
			source_x: -100,
			source_y: 0,
			source_z: -1000,
			destination_x: 100,
			destination_y: 0,
			destination_z: -1000
		},
		{
			type: "MESSAGE",
			source_x: 100,
			source_y: -50,
			source_z: -1000,
			destination_x: -100,
			destination_y: -50,
			destination_z: -1000
		},
		{
			type: "TEXT",
			source_x: -250,
			source_y: 300,
			source_z: -1000,
			text_string: "Layer1",
			text_size: 12
		},
		{
			type: "TEXT",
			source_x: -50,
			source_y: 5,
			source_z: -1000,
			text_string: "Sample call params ",
			text_size: 8
		},
		{
			type: "TEXT",
			source_x: -120,
			source_y: 250,
			source_z: -1000,
			text_string: "Lifeline1",
			text_size: 8
		},
		{
			type: "TEXT",
			source_x: 80,
			source_y: 250,
			source_z: -1000,
			text_string: "Lifeline2",
			text_size: 8
		}
	]
},{
	upsert: true
});