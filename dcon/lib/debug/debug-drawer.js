window.KinectGestures = window.KinectGestures ? window.KinectGestures : {};

(function(){

    function DebugDrawer()
    {
        let canvasEl = null,
            context = null;

        let record = false;
        
        var playerlost = false;
        
        let previousDeltaX = 0, previousProximity = 1, previousDeltaAngle = Math.PI/2;
        
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
                  JointType.ElbowLeft,
                  JointType.ElbowRight,
                  JointType.Head,
                  JointType.Spine,
              ];
          for (var i = jointsToCheck.length - 1; i >= 0; i--) {
              if (skeleton.joints[jointsToCheck[i]].trackingState < 2){
                  return false;
              }
          }
          return true;
        }

        function update(frame)
        {

            let skeletonPromises = [];
            for (let iSkeleton = 0; iSkeleton < frame.skeletons.length; ++iSkeleton) {
                let skeleton = frame.skeletons[iSkeleton];
                if (skeleton.trackingState > 0){
                    skeletonPromises.push(updateSkeleton(skeleton, iSkeleton));
                }
            }
            if (skeletonPromises.length > 0) {
              playerlost = false;
              let skeletonSumX = 0;
              let skeletonSumZ = 0;
              let numSkeleton = 0;
              let skeletonSumHandsX = 0;
              let skeletonSumHandsY = 0;
              let skeletonAngle = 0;
              Promise.all(skeletonPromises).then((results) => {
                results.map((sums) => {
                  if (sums.length !== 0) {
                    skeletonSumZ += sums.z;
                    skeletonSumX += (sums.x / sums.length);
                    skeletonSumHandsX += sums.xhands || 0;
                    skeletonSumHandsY += sums.yhands || 0;
                    skeletonAngle += sums.angle;
                    numSkeleton++;
                  }
                });
                if (numSkeleton == 0) {
                  return;
                }
                let proximity = (skeletonSumZ / numSkeleton);
                let deltaProximity = proximity - previousProximity;
                // if (Math.abs(deltaProximity) >= 0.005 && Math.abs(deltaProximity) <= 0.1) {
                //   console.log();
                //   proximity = deltaProximity > 0 ? previousProximity - 0.005 : previousProximity + 0.005; 
                // }
                if (Math.abs(deltaProximity) > 0.2) {
                  let value = Math.min(previousProximity + 0.05, Math.max(previousProximity - 0.05, proximity));
                  Ptypo.changeParam(4000 / (value * 18 + 0.01), 'thickness', 'grotesk-font');
                  previousProximity = value;
                }

                let deltax = (skeletonSumX / numSkeleton);
                let dx = deltax - previousDeltaX;
                // if (Math.abs(dx) >= 0.005 && Math.abs(dx) <= 0.2) {
                //   deltax = dx > 0 ? previousDeltaX - 0.005 : previousDeltaX + 0.005; 
                // }
                if (Math.abs(dx) > 0.05) {
                  value = Math.min(previousDeltaX + 0.02, Math.max(previousDeltaX - 0.02, deltax));
                  Ptypo.changeParam((1+value*8), 'curviness', 'grotesk-font');
                  previousDeltaX = value;
                }

                let deltaAngle = (skeletonAngle / numSkeleton);
                let da = deltaAngle - previousDeltaAngle;
                // if (Math.abs(da) >= 0.005 && Math.abs(da) <= 0.2) {
                //   deltaAngle = da > 0 ? previousDeltaAngle - 0.005 : previousDeltaAngle + 0.005; 
                // }
                if (Math.abs(da) > Math.PI/80) {
                  value = Math.min(Math.PI/2 + Math.PI/3, Math.max(Math.PI/2-Math.PI/3, Math.min(previousDeltaAngle + Math.PI/120, Math.max(previousDeltaAngle - Math.PI/120, deltaAngle))));
                  Ptypo.changeParam(90 - value * (180 / Math.PI), 'slant', 'grotesk-font');
                  previousDeltaAngle = value;
                }
              });
            }
            else if (!playerlost){
                  playerlost = true;
                  Ptypo.tween(115, 'thickness', 'grotesk-font', 60, 2);
                  Ptypo.tween(0, 'curviness', 'grotesk-font', 60, 2);
                  Ptypo.tween(1, 'width', 'grotesk-font', 60, 2);
                  Ptypo.tween(230, 'capDelta', 'grotesk-font', 60, 2);
                  Ptypo.changeParam(0, 'slant', 'grotesk-font');
            }
        }
        function updateSkeleton(skeleton, index)
        {
          return new Promise((resolve, reject) => {
            // Z axis
            let jointNum = 0;
            let sumz = skeleton.joints[0].position.z || 1;

            // X axis
            let sumx = 0;
            for (let iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
                let joint = skeleton.joints[iJoint];
                if (joint.trackingState === 2) {
                  sumx = sumx + joint.position.x;
                  jointNum ++;
                }
            }
            
            //angle
            let angle = 0;
            if (skeleton.joints[3].trackingState === 2 && skeleton.joints[0].trackingState === 2) {
              angle = Math.atan2(skeleton.joints[3].position.y - skeleton.joints[0].position.y, skeleton.joints[3].position.x - skeleton.joints[0].position.x);
            }
            else {
              angle = Math.PI/2;
            }
            resolve({
              x: sumx,
              z: sumz,
              angle,
              length: jointNum
            });
          });
        }

        return {
            update:update
        };
    }

    KinectGestures.DebugDrawer = DebugDrawer();

})(window);
