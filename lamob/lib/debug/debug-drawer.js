window.KinectGestures = window.KinectGestures ? window.KinectGestures : {};

(function() {
    function DebugDrawer() {
        let canvasEl = null,
            context = null;

        let record = false;

        var playerlost = false;

        function isWellFormed(skeleton) {
            var jointsToCheck = [
                JointType.HipCenter,
                JointType.HipLeft,
                JointType.HipRight,
                JointType.KneeRight,
                JointType.KneeLeft,
                JointType.ShoulderLeft,
                JointType.ShoulderRight,
                JointType.ShoulderCenter,
                JointType.Head,
                JointType.Spine,
            ];
            for (var i = jointsToCheck.length - 1; i >= 0; i--) {
                if (skeleton.joints[jointsToCheck[i]].trackingState < 2) {
                    return false;
                }
            }
            return true;
        }

        function update(frame) {
            let skeleton = undefined;
            for (let iSkeleton = 0; iSkeleton < frame.skeletons.length; ++iSkeleton) {
                if (frame.skeletons[iSkeleton].trackingState > 0 && isWellFormed(frame.skeletons[iSkeleton])) {
                    skeleton = frame.skeletons[iSkeleton];
                }
            }

            if (skeleton) {
                updateSkeleton(skeleton).then((sums) => {
                    playerlost = false;
                    if (sums.z) {
                        let deltaz = sums.z / sums.length;
                        Ptypo.changeParam(Math.abs(parseFloat(35 * deltaz) + 1), 'thickness', 'antique-font');
                    }
                    if (sums.x) {
                        let deltax = sums.x / sums.length;
                        Ptypo.changeParam(parseFloat((0.6 + deltax)), 'curviness', 'antique-font');
                    }
                    if (sums.yhands) {
                        let deltahandsy = sums.yhands;
                        Ptypo.changeParam(((deltahandsy * 500) + 350), 'xHeight', 'antique-font');
                    }
                    if (sums.xhands) {
                        let deltahandsx = sums.xhands;
                        Ptypo.changeParam((deltahandsx * 3), 'width', 'antique-font');
                    }
                    if (sums.zhandright) {
                        let deltahandzright = sums.zhandright;
                        Ptypo.changeParam(Math.abs((deltahandzright * 500) + 150), 'ascender', 'antique-font');
                    }
                    if (sums.zhandleft) {
                        let deltahandzleft = sums.zhandleft;
                        Ptypo.changeParam(-Math.abs((deltahandzleft * 500) + 150), 'descender', 'antique-font');
                    }
                    if (sums.angle) {
                        let radAngle = Math.atan(1.8 / sums.angle);
                        Ptypo.changeParam((90 - (radAngle * (180 / Math.PI)) * 3), 'slant', 'antique-font');
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
                let jointNum = 0;
                var xhands, yhands, zhandleft, zhandright, angle;
                // Z axis

                let sumz = 0;
                for (let iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
                    let joint = skeleton.joints[iJoint];
                    if (joint.trackingState === 2) {
                        sumz = sumz + joint.position.z;
                        jointNum++;
                    }
                }

                // X axis
                let sumx = 0;
                for (let iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
                    let joint = skeleton.joints[iJoint];
                    if (joint.trackingState === 2) {
                        sumx = sumx + joint.position.x;
                    }
                }


                if (skeleton.joints[7].trackingState === 2 && skeleton.joints[7].trackingState === 2) {
                    yhands = Math.abs(skeleton.joints[7].position.y - skeleton.joints[11].position.y);
                    xhands = Math.abs(skeleton.joints[7].position.x - skeleton.joints[11].position.x);
                }
                if (skeleton.joints[7].trackingState === 2 && skeleton.joints[3].trackingState === 2) {
                    zhandleft = (skeleton.joints[7].position.z - skeleton.joints[3].position.z);
                }
                if (skeleton.joints[11].trackingState === 2 && skeleton.joints[3].trackingState === 2) {
                    zhandright = (skeleton.joints[11].position.z - skeleton.joints[3].position.z);
                }
                if (skeleton.joints[3].trackingState === 2 && skeleton.joints[0].trackingState === 2) {
                    angle = (skeleton.joints[3].position.x - skeleton.joints[0].position.x);
                }


                resolve({
                    x: sumx,
                    z: sumz,
                    xhands,
                    yhands,
                    zhandleft,
                    zhandright,
                    angle,
                    length: jointNum
                });
            });
        }

        return {
            update: update
        };
    }

    KinectGestures.DebugDrawer = DebugDrawer();

})(window);