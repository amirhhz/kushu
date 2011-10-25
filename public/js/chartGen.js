function generateStreamChart2()
        {

            var chart1 = new RGraph.Bar('chart1', [[12,15,19], [11,14, 9], [10,15,3]]);
            //chart1.Set('chart.units.pre', '$');
            chart1.Set('chart.title', '1Wk Progress (cards viewed)');
            chart1.Set('chart.title.vpos', 0.5);
            chart1.Set('chart.colors', ['purple', 'blue', 'green']);
            chart1.Set('chart.gutter.left', 40);
            chart1.Set('chart.gutter.right', 5);
            chart1.Set('chart.gutter.top', 40);
            chart1.Set('chart.gutter.bottom', 50);
            chart1.Set('chart.shadow', true);
            chart1.Set('chart.shadow.color', '#aaa');
            chart1.Set('chart.background.barcolor1', 'white');
            chart1.Set('chart.background.barcolor2', 'white');
            chart1.Set('chart.background.grid.hsize', 5);
            chart1.Set('chart.background.grid.vsize', 5);
            chart1.Set('chart.grouping', 'stacked');
            chart1.Set('chart.labels', ['French', 'Capitals', 'StaffPics']);
            chart1.Set('chart.labels.above', true);
            chart1.Set('chart.key', ['Needs Work', 'Unsure', 'Correct']);
            chart1.Set('chart.key.background', 'rgba(255,255,255,0.7)');
            chart1.Set('chart.key.position', 'gutter');
            chart1.Set('chart.key.position.gutter.boxed', false);
            chart1.Set('chart.key.position.y', chart1.Get('chart.gutter.top') - 15);
            chart1.Set('chart.key.border', false);
            chart1.Set('chart.background.grid.width', 0.3); // Decimals are permitted
            chart1.Set('chart.text.angle', 35);
            chart1.Set('chart.strokestyle', 'rgba(0,0,0,0)');
            chart1.Set('chart.tooltips.event', 'onmousemove');
            
            if (!RGraph.isIE8()) {
                tooltipFunc = function (i)
                {
                    var r = i % 4;
                    
                    if (r == 3) return 'John'
                    else if (r == 2) return 'Needs Work';
                    else if (r == 1) return 'Unsure';
                    else if (r == 0) return 'Correct';
                }
                chart1.Set('chart.tooltips', tooltipFunc);
            }

            if (!RGraph.isIE8()) {
                RGraph.Effects.Bar.Grow(chart1);
            } else {
                chart1.Draw();
            }
        }
		
		function generatePie(){
		     var chart1 = new RGraph.Pie('chart1', [41,37,16,6]); // Create the pie object
            chart1.Set('chart.labels', ['StaffPics (41%)', 'Capitals (37%)', 'French (16%)', 'Other (6%)']);
            chart1.Set('chart.labels.sticks', true);
            chart1.Set('chart.gutter.left', 30);
            chart1.Set('chart.gutter.right', 30);
            chart1.Set('chart.gutter.top', 35);
            chart1.Set('chart.gutter.bottom', 35);
            chart1.Set('chart.title', "Work share");
            chart1.Set('chart.title.vpos', 0.3);
            chart1.Set('chart.shadow', false);
            chart1.Set('chart.tooltips.effect', 'fade');
            chart1.Set('chart.tooltips.event', 'onmousemove');
            //chart1.Set('chart.exploded', [0,0,15,25]);
            chart1.Set('chart.tooltips', [
                                        'Staff Photos (41%)',
                                        'Capital Cities (37%)',
                                        'French Nouns (16%)',
                                        'Other (6%)'
                                       ]
                                      );
            chart1.Set('chart.highlight.style', '2d');
            chart1.Set('chart.linewidth', 2);
            chart1.Set('chart.strokestyle', 'rgba(255,255,255,1)');
            chart1.Set('chart.shadow', true);
            chart1.Set('chart.shadow.offsetx', 0);
            chart1.Set('chart.shadow.offsety', 0);
            chart1.Set('chart.shadow.blur', 15);
            chart1.Set('chart.exploded', [0,0,20,20]);
            
            if (RGraph.isIE8()) {
                chart1.Draw();
            } else {
                RGraph.Effects.Pie.Grow(chart1);
            }
		
		
		}
		
        function generateStreamChart()
        {

            var chart1 = new RGraph.Bar('chart1', [[12,15,19], [11,14, 9], [10,15,3], [3,1,2], [12,9,20], [15,2,8], [19,6,2]]);
            //chart1.Set('chart.units.pre', '$');
            chart1.Set('chart.title', '1Wk Progress (cards viewed)');
            chart1.Set('chart.title.vpos', 0.5);
            chart1.Set('chart.colors', ['red', 'blue', 'green']);
            chart1.Set('chart.gutter.left', 40);
            chart1.Set('chart.gutter.right', 5);
            chart1.Set('chart.gutter.top', 40);
            chart1.Set('chart.gutter.bottom', 50);
            chart1.Set('chart.shadow', true);
            chart1.Set('chart.shadow.color', '#aaa');
            chart1.Set('chart.background.barcolor1', 'white');
            chart1.Set('chart.background.barcolor2', 'white');
            chart1.Set('chart.background.grid.hsize', 5);
            chart1.Set('chart.background.grid.vsize', 5);
            chart1.Set('chart.grouping', 'stacked');
            chart1.Set('chart.labels', ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
            chart1.Set('chart.labels.above', true);
            chart1.Set('chart.key', ['Needs Work', 'Unsure', 'Correct']);
            chart1.Set('chart.key.background', 'rgba(255,255,255,0.7)');
            chart1.Set('chart.key.position', 'gutter');
            chart1.Set('chart.key.position.gutter.boxed', false);
            chart1.Set('chart.key.position.y', chart1.Get('chart.gutter.top') - 15);
            chart1.Set('chart.key.border', false);
            chart1.Set('chart.background.grid.width', 0.3); // Decimals are permitted
            chart1.Set('chart.text.angle', 35);
            chart1.Set('chart.strokestyle', 'rgba(0,0,0,0)');
            chart1.Set('chart.tooltips.event', 'onmousemove');
            
            if (!RGraph.isIE8()) {
                tooltipFunc = function (i)
                {
                    var r = i % 4;
                    
                    if (r == 3) return 'John'
                    else if (r == 2) return 'Needs Work';
                    else if (r == 1) return 'Unsure';
                    else if (r == 0) return 'Correct';
                }
                chart1.Set('chart.tooltips', tooltipFunc);
            }

            if (!RGraph.isIE8()) {
                RGraph.Effects.Bar.Grow(chart1);
            } else {
                chart1.Draw();
            }
        }