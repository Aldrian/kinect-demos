window.KinectGestures = window.KinectGestures ? window.KinectGestures : {};

(function(){

    function DebugDrawer()
    {
        let canvasEl = null,
            context = null;

        let record = false;
        
        var playerlost = false;
        
        let previousDeltaX = 0, previousProximity = 0, previousDeltaAngle = 0;
        
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
                if (skeleton.trackingState > 0 && isWellFormed(skeleton)){
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
                  skeletonSumZ += (sums.z / sums.length);
                  skeletonSumX += (sums.x / sums.length);
                  skeletonSumHandsX += sums.xhands;
                  skeletonSumHandsY += sums.yhands;
                  skeletonAngle += sums.angle;
                  numSkeleton++;
                });
                let proximity = (skeletonSumZ / numSkeleton);
                let deltaProximity = proximity - previousProximity;
                // if (Math.abs(deltaProximity) >= 0.005 && Math.abs(deltaProximity) <= 0.1) {
                //   console.log();
                //   proximity = deltaProximity > 0 ? previousProximity - 0.005 : previousProximity + 0.005; 
                // }
                Ptypo.changeParam(75 * (4 - proximity), 'thickness', 'grotesk-font');
                previousProximity = proximity;
                
                let deltax = (skeletonSumX / numSkeleton);
                let dx = deltax - previousDeltaX;
                // if (Math.abs(dx) >= 0.005 && Math.abs(dx) <= 0.2) {
                //   deltax = dx > 0 ? previousDeltaX - 0.005 : previousDeltaX + 0.005; 
                // }
                Ptypo.changeParam(Math.pow(deltax, 3) * 3, 'curviness', 'grotesk-font');
                previousDeltaX = deltax;

                let deltaAngle = (skeletonAngle / numSkeleton);
                let da = deltaAngle - previousDeltaAngle;
                // if (Math.abs(da) >= 0.005 && Math.abs(da) <= 0.2) {
                //   deltaAngle = da > 0 ? previousDeltaAngle - 0.005 : previousDeltaAngle + 0.005; 
                // }
                let radAngle = Math.atan(1.8 / deltaAngle);
                Ptypo.changeParam((90 - (radAngle * (180 / Math.PI)) * 3 ), 'slant', 'grotesk-font');
                previousDeltaAngle = deltaAngle;
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
            let sumz = 0;
            for (let iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
                let joint = skeleton.joints[iJoint];
                if (joint.trackingState === 2) {
                  sumz = sumz + joint.position.z;
                  jointNum ++;
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
            
            //angle
            let angle = 0;
            if (skeleton.joints[3].trackingState === 2 && skeleton.joints[0].trackingState === 2) {
              angle = (skeleton.joints[3].position.x - skeleton.joints[0].position.x);
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
