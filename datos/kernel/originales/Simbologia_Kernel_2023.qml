<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis styleCategories="Symbology" version="3.40.10-Bratislava">
  <pipe-data-defined-properties>
    <Option type="Map">
      <Option value="" name="name" type="QString"/>
      <Option name="properties"/>
      <Option value="collection" name="type" type="QString"/>
    </Option>
  </pipe-data-defined-properties>
  <pipe>
    <provider>
      <resampling zoomedInResamplingMethod="nearestNeighbour" zoomedOutResamplingMethod="nearestNeighbour" maxOversampling="2" enabled="false"/>
    </provider>
    <rasterrenderer classificationMin="-34.5968819" opacity="0.6" band="1" classificationMax="46.1790466" type="singlebandpseudocolor" alphaBand="-1" nodataColor="">
      <rasterTransparency/>
      <minMaxOrigin>
        <limits>None</limits>
        <extent>WholeRaster</extent>
        <statAccuracy>Estimated</statAccuracy>
        <cumulativeCutLower>0.02</cumulativeCutLower>
        <cumulativeCutUpper>0.98</cumulativeCutUpper>
        <stdDevFactor>2</stdDevFactor>
      </minMaxOrigin>
      <rastershader>
        <colorrampshader labelPrecision="3" colorRampType="INTERPOLATED" minimumValue="-34.5968819" maximumValue="46.1790466" classificationMode="2" clip="0">
          <colorramp name="[source]" type="gradient">
            <Option type="Map">
              <Option value="255,245,240,255,rgb:1,0.96078431372549022,0.94117647058823528,1" name="color1" type="QString"/>
              <Option value="103,0,13,255,rgb:0.40392156862745099,0,0.05098039215686274,1" name="color2" type="QString"/>
              <Option value="ccw" name="direction" type="QString"/>
              <Option value="0" name="discrete" type="QString"/>
              <Option value="gradient" name="rampType" type="QString"/>
              <Option value="rgb" name="spec" type="QString"/>
              <Option value="0.25;252,191,166,255,hsv:0.04783333333333333,0.34000152590218968,0.98884565499351496,1;rgb;ccw:0.5;251,245,243,255,hsv:0.03119444444444444,0.03158617532616159,0.98492408636606399,1;rgb;ccw:0.75;211,32,32,255,rgb:0.82865644312199593,0.1257953765163653,0.12730601968413824,1;rgb;ccw" name="stops" type="QString"/>
            </Option>
          </colorramp>
          <item color="#fff5f0" label="-34,597" alpha="255" value="-34.5968819"/>
          <item color="#fcbfa6" label="-14,403" alpha="255" value="-14.402899775000002"/>
          <item color="#fbf5f3" label="5,791" alpha="255" value="5.791082349999996"/>
          <item color="#d32020" label="25,985" alpha="255" value="25.985064474999994"/>
          <item color="#67000d" label="46,179" alpha="255" value="46.17904659999999"/>
          <rampLegendSettings useContinuousLegend="1" orientation="2" maximumLabel="" minimumLabel="" suffix="" direction="0" prefix="">
            <numericFormat id="basic">
              <Option type="Map">
                <Option name="decimal_separator" type="invalid"/>
                <Option value="6" name="decimals" type="int"/>
                <Option value="0" name="rounding_type" type="int"/>
                <Option value="false" name="show_plus" type="bool"/>
                <Option value="true" name="show_thousand_separator" type="bool"/>
                <Option value="false" name="show_trailing_zeros" type="bool"/>
                <Option name="thousand_separator" type="invalid"/>
              </Option>
            </numericFormat>
          </rampLegendSettings>
        </colorrampshader>
      </rastershader>
    </rasterrenderer>
    <brightnesscontrast contrast="0" brightness="0" gamma="1"/>
    <huesaturation colorizeOn="0" saturation="0" invertColors="0" colorizeBlue="128" grayscaleMode="0" colorizeStrength="100" colorizeRed="255" colorizeGreen="128"/>
    <rasterresampler maxOversampling="2"/>
    <resamplingStage>resamplingFilter</resamplingStage>
  </pipe>
  <blendMode>0</blendMode>
</qgis>
