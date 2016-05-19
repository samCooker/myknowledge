package cn.com.chaochuang;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Cookie on 2016/5/18.
 */
public class MapNavigation extends CordovaPlugin{

    @Override
    public boolean execute(String action, JSONArray jsonArray, CallbackContext callbackContext) throws JSONException {
        if (action.equals("navigate")){
            try {
                Activity activity = this.cordova.getActivity();
                //导航选项
                Options options = new Options().fromJson(jsonArray);
                Intent intent = null;
                if(appInstalled("com.baidu.BaiduMap")){
                    //如果有百度地图
                    intent = Intent.parseUri("intent://map/direction?"
                            + "origin="+options.getOrigin4Baidu()
                            + "&destination="+options.getDestination4Baidu()
                            + "&mode="+options.model
                            + "&referer=Autohome|GasStation#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end",0);
                    activity.startActivity(intent);
                    callbackContext.success(options.getOrigin4Baidu());
                }else if(appInstalled("com.autonavi.minimap")){
                    //如果有高德地图
                    StringBuilder builder =new StringBuilder("androidamap://route?sourceApplication=softname" +options.getOrigin4Mini()+options.getDestination4Mini()+
                            "&dev=0&m=0&t=1");
                    intent = Intent.parseUri(builder.toString(),0);
                    activity.startActivities(new Intent[]{intent});
                    callbackContext.success("成功调用高德地图。");
                }else {
                    callbackContext.error("您还没有安装百度地图和高德地图。");
                }
                return true;
            }catch (Exception e){
                e.printStackTrace();
                callbackContext.error(e.toString());
            }
        }
        return false;
    }

    /**
     * 检查app是否已经安装
     * @param uri
     * @return
     */
    public boolean appInstalled(String uri) {
        Context ctx = this.cordova.getActivity().getApplicationContext();
        final PackageManager pm = ctx.getPackageManager();
        boolean app_installed = false;
        try {
            pm.getPackageInfo(uri, PackageManager.GET_ACTIVITIES);
            app_installed = true;
        }
        catch(PackageManager.NameNotFoundException e) {
            app_installed = false;
        }
        return app_installed;
    }

    private final class Options {

        private String originLat;
        private String originLng;
        private String originName;
        private String destLat;
        private String destLng;
        private String destName;
        //transit、driving、walking，分别表示公交、驾车和步行
        private String model;

        private String src;

        public Options() {

        }

        public Options fromJson(JSONArray data){
            JSONObject options = data.optJSONObject(0);
            this.originLat = options.optString("originLat","");
            this.originLng = options.optString("originLng","");
            this.originName = options.optString("originName","");

            this.destLat = options.optString("destLat","");
            this.destLng = options.optString("destLng","");
            this.destName = options.optString("destName","");
            //默认步行
            this.model = options.optString("model","walking");

            this.src = options.optString("src","");

            return this;
        }

        public String getOrigin4Baidu(){
            if(this.isNotBlank(this.originName)&&this.isNotBlank(this.originLat)&&this.isNotBlank(this.originLng)){
                return "latlng:"+this.originLat+","+this.originLng+"|name:"+this.originName;
            }else if(this.isNotBlank(this.originName)){
                return "name:"+this.originName;
            }else if(this.isNotBlank(this.originLat)&&this.isNotBlank(this.originLng)){
                return "latlng:"+this.originLat+","+this.originLng;
            }
            return "";
        }

        public String getDestination4Baidu(){
            if(this.isNotBlank(this.destName)&&this.isNotBlank(this.destLat)&&this.isNotBlank(this.destLng)){
                return "latlng:"+this.destLat+","+this.destLng+"|name:"+this.destName;
            }else if(this.isNotBlank(this.destName)){
                return "name:"+this.destName;
            }else if(this.isNotBlank(this.destLat)&&this.isNotBlank(this.destLng)){
                return "latlng:"+this.destLat+","+this.destLng;
            }
            return "";
        }

        public String getOrigin4Mini(){
            if(this.isNotBlank(this.destName)&&this.isNotBlank(this.destLat)&&this.isNotBlank(this.destLng)){
                return "&slat="+this.destLat+"&slon="+this.destLng+"&sname="+this.destName;
            }else if(this.isNotBlank(this.destLat)&&this.isNotBlank(this.destLng)){
                return "&slat="+this.destLat+"&slon="+this.destLng;
            }
            return "";
        }

        public String getDestination4Mini(){
            if(this.isNotBlank(this.destName)&&this.isNotBlank(this.destLat)&&this.isNotBlank(this.destLng)){
                return "&dlat="+this.destLat+"&dlon="+this.destLng+"&dname="+this.destName;
            }else if(this.isNotBlank(this.destLat)&&this.isNotBlank(this.destLng)){
                return "&dlat="+this.destLat+"&dlon="+this.destLng;
            }
            return "";
        }

        public boolean isNotBlank(String s){
            return s!=null&&!"".equals(s.trim());
        }
    }

}
