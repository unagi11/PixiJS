precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 toCenter = vec2(0.5) - st;
    float angle = atan(toCenter.y, toCenter.x);
    float radius = length(toCenter) * 2.0;

    // Add distortion
    float distortion = sin(radius * 30.0 - uTime * 10.0);
    radius += distortion * 0.1;

    // Add color
    vec3 color = vec3(0.3294, 0.6, 0.5176);
    gl_FragColor =  vec4(color, 0);
}
