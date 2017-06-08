window.KinectGestures = window.KinectGestures ? window.KinectGestures : {};

(function() {
    function DebugDrawer() {
        let canvasEl = null,
            context = null;

        let record = false;

        var playerlost = false;

        let previousProximity = 1,
            previousX = 0,
            previousHandY = 0,
            previousHandX = 0,
            previousAngle = Math.PI / 2,
            previousHandZRight = 0,
            previousHandZLeft = 0;

        let previousplayer = 0;

        function update(frame) {
            if (frame.skeletons[previousplayer].trackingState < 2) {
                for (let iSkeleton = 0; iSkeleton < frame.skeletons.length; ++iSkeleton) {
                    if (frame.skeletons[iSkeleton].trackingState === 2) {
                        previousplayer = iSkeleton;
                    }
                }
            }


            // if (skeleton) {
            //     updateSkeleton(skeleton).then((sums) => {
            //         playerlost = false;
            //         let deltaz = sums.z;
            //         Ptypo.changeParam(Math.abs(parseFloat(35 * deltaz) + 1), 'thickness', 'antique-font');
            //         let deltax = sums.x / sums.length;
            //         Ptypo.changeParam(parseFloat((0.6 + deltax)), 'curviness', 'antique-font');
            //         let deltahandsy = sums.yhands;
            //         Ptypo.changeParam(((deltahandsy * 500) + 350), 'xHeight', 'antique-font');
            //         let deltahandsx = sums.xhands;
            //         Ptypo.changeParam((deltahandsx * 3), 'width', 'antique-font');
            //         let deltahandzright = sums.zhandright;
            //         Ptypo.changeParam(Math.abs((deltahandzright * 500) + 150), 'ascender', 'antique-font');
            //         let deltahandzleft = sums.zhandleft;
            //         Ptypo.changeParam(-Math.abs((deltahandzleft * 500) + 150), 'descender', 'antique-font');
            //         let radAngle = Math.atan(1.8 / sums.angle);
            //         Ptypo.changeParam((90 - (radAngle * (180 / Math.PI)) * 3), 'slant', 'antique-font');
            //     });
            // } else if (!playerlost) {
            //     playerlost = true;
            //     Ptypo.tween(54, 'thickness', 'antique-font', 60, 1);
            //     Ptypo.tween(0.6, 'curviness', 'antique-font', 60, 1);
            //     Ptypo.tween(1, 'width', 'antique-font', 60, 1);
            //     Ptypo.changeParam(0, 'slant', 'antique-font');
            //     Ptypo.tween(600, 'xHeight', 'antique-font', 60, 1);
            //     Ptypo.tween(100, 'ascender', 'antique-font', 60, 1);
            //     Ptypo.tween(-90, 'descender', 'antique-font', 60, 1);
            // }



            if (frame.skeletons[previousplayer].trackingState > 1) {
                updateSkeleton(frame.skeletons[previousplayer]).then((sums) => {
                    playerlost = false;


                    let proximity = sums.z;
                    let deltaProximity = proximity - previousProximity;
                    if (Math.abs(deltaProximity) > 0.15) {
                        let value = proximity;
                        Ptypo.changeParam((40 * (3.5 - value)), 'thickness', 'antique-font');
                        previousProximity = value;
                    }


                    let x = sums.x / sums.length;
                    let deltaX = x - previousX;
                    if (Math.abs(deltaX > 0.05)) {
                        value = x;
                        Ptypo.changeParam(parseFloat((0.6 + value / 2)), 'curviness', 'antique-font');
                        previousX = value;
                    }


                    let handsy = sums.yhands;
                    let deltahandsy = handsy - previousHandY;
                    if (Math.abs(deltahandsy) > 0.05) {
                        value = handsy;
                        Ptypo.changeParam(((value * 500) + 350), 'xHeight', 'antique-font');
                        previousHandY = value;
                    }

                    let handsx = sums.xhands;
                    let deltahandsx = handsx - previousHandX;
                    if (Math.abs(deltahandsx) > 0.05) {
                        value = handsx;
                        Ptypo.changeParam((value * 3), 'width', 'antique-font');
                        previousHandX = value;
                    }

                    let handzright = sums.zhandright;
                    let deltahandzright = handzright - previousHandZRight;
                    if (Math.abs(deltahandzright) > 0.05) {
                        value = handzright;
                        Ptypo.changeParam((value * 600) + 80, 'ascender', 'antique-font');;
                        previousHandZRight = value;
                    }

                    let handzleft = sums.zhandleft;
                    let deltahandzleft = handzleft - previousHandZLeft;
                    if (Math.abs(deltahandzleft) > 0.05) {
                        value = handzleft;
                        Ptypo.changeParam(-((value * 600) + 80), 'descender', 'antique-font');;
                        previousHandZLeft = value;
                    }

                    let angle = sums.angle;
                    let deltaAngle = angle - previousAngle;
                    if (Math.abs(deltaAngle) > Math.PI / 80) {
                        value = Math.min(Math.PI / 2 + Math.PI / 2.8, Math.max(Math.PI / 2 - Math.PI / 2.8, Math.min(previousAngle + Math.PI / 120, Math.max(previousAngle - Math.PI / 120, angle))));
                        Ptypo.changeParam(90 - value * (180 / Math.PI), 'slant', 'antique-font');
                        previousAngle = value;
                    }
                });
            } else if (!playerlost) {
                playerlost = true;
                Ptypo.tween(54, 'thickness', 'antique-font', 60, 1);
                Ptypo.tween(0.6, 'curviness', 'antique-font', 60, 1);
                Ptypo.tween(1, 'width', 'antique-font', 60, 1);
                Ptypo.changeParam(0, 'slant', 'antique-font');
                Ptypo.tween(600, 'xHeight', 'antique-font', 60, 1);
                Ptypo.tween(100, 'ascender', 'antique-font', 60, 1);
                Ptypo.tween(-90, 'descender', 'antique-font', 60, 1);
            }
        }

        function updateSkeleton(skeleton) {
            return new Promise((resolve, reject) => {
                // Z axis
                let sumz = skeleton.joints[3].position.z || 2;

                // X axis
                let sumx = 0;
                for (let iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
                    let joint = skeleton.joints[iJoint];
                    sumx = sumx + joint.position.x;
                }


                let yhands = Math.abs(skeleton.joints[7].position.y - skeleton.joints[11].position.y);
                let xhands = Math.abs(skeleton.joints[7].position.x - skeleton.joints[11].position.x);
                let zhandright = Math.abs(skeleton.joints[11].position.z - skeleton.joints[3].position.z) || 0;
                let zhandleft = Math.abs(skeleton.joints[7].position.z - skeleton.joints[3].position.z) || 0;

                //angle
                let angle = 0;
                if (skeleton.joints[3].trackingState === 2 && skeleton.joints[0].trackingState === 2) {
                    angle = Math.atan2(skeleton.joints[3].position.y - skeleton.joints[0].position.y, skeleton.joints[3].position.x - skeleton.joints[0].position.x);
                } else {
                    angle = Math.PI / 2;
                }

                resolve({
                    x: sumx,
                    z: sumz,
                    xhands,
                    yhands,
                    zhandright,
                    zhandleft,
                    length: skeleton.joints.length,
                    angle,
                });
            });
        }

        return {
            update: update
        };
    }

    KinectGestures.DebugDrawer = DebugDrawer();

})(window);