package pl.adshares.adpanel.tools;

import java.util.HashMap;

public class Maps {

  private static HashMap<String, String> email;
  private static HashMap<String, String> password;
  private static HashMap<String, String> url_panel;
  private static HashMap<String, String> url_mailcatcher;
  private static HashMap<String, String> url_mailhog;
  private static HashMap<String, String> url_target;
  private static HashMap<String, Integer> id;
  private static HashMap<String, String> lista1;
  private static HashMap<String, String> lista2;
  private static HashMap<String, String> lista3;
//  ADVERTISER - Basic Information
  private static HashMap<String, String> campaign_name;
  private static HashMap<String, String> target_url;
  private static HashMap<String, String> bid_strategy;
  private static HashMap<String, String> bid_value;
  private static HashMap<String, String> budget;
  private static HashMap<String, String> date_of_start;
  private static HashMap<String, String> date_of_end;
//  ADVERTISER - Additional Targeting
  private static HashMap<String, String> requires1;
  private static HashMap<String, String> requires2;
  private static HashMap<String, String> requires3;
  private static HashMap<String, String> excludes1;
  private static HashMap<String, String> excludes2;
  private static HashMap<String, String> excludes3;
//  ADVERTISER - Create Ads
  private static HashMap<String, String> short_headline;
  private static HashMap<String, String> ad_type;
  private static HashMap<String, String> size;
  private static HashMap<String, String> html_code;

  public static void create() {
    email = new HashMap<>();
    password = new HashMap<>();
  }
  public static void url() {
    url_panel = new HashMap<>();
    url_mailcatcher = new HashMap<>();
    url_mailhog = new HashMap<>();
    url_target = new HashMap<>();
  }
  public static void createLista() {
    lista1 = new HashMap<>();
    lista2 = new HashMap<>();
    lista3 = new HashMap<>();
  }
  public static void createBasicInformation() {
    campaign_name = new HashMap<>();
    target_url = new HashMap<>();
    bid_strategy = new HashMap<>();
    bid_value = new HashMap<>();
    budget = new HashMap<>();
    date_of_start = new HashMap<>();
    date_of_end = new HashMap<>();
  }
  public static void createAdditionalTargeting() {
    requires1 = new HashMap<>();
    requires2 = new HashMap<>();
    requires3 = new HashMap<>();
    excludes1 = new HashMap<>();
    excludes2 = new HashMap<>();
    excludes3 = new HashMap<>();
  }
  public static void createAds() {
    short_headline = new HashMap<>();
    ad_type = new HashMap<>();
    size = new HashMap<>();
    html_code = new HashMap<>();
  }
  public static void createId() {
    id = new HashMap<>();
  }

  public static void email          (String name, String value) { email.put(name, value); }
  public static void password       (String name, String value) { password.put(name, value); }
  public static void id             (String name, int value)    { id.put(name, value);  }
  public static void url_panel      (String name, String value) { url_panel.put(name, value);}
  public static void url_mailcatcher(String name, String value) { url_mailcatcher.put(name, value);}
  public static void url_mailhog    (String name, String value) { url_mailhog.put(name, value);}
  public static void url_target     (String name, String value) { url_target.put(name, value);}
  public static void lista1         (String name, String value) { lista1.put(name, value);}
  public static void lista2         (String name, String value) { lista2.put(name, value);}
  public static void lista3         (String name, String value) { lista3.put(name, value);}
  public static void campaign_name  (String name, String value) { campaign_name.put(name, value);}
  public static void target_url     (String name, String value) { target_url.put(name, value);}
  public static void bid_strategy   (String name, String value) { bid_strategy.put(name, value);}
  public static void bid_value      (String name, String value) { bid_value.put(name, value);}
  public static void budget  (String name, String value) { budget.put(name, value);}
  public static void date_of_start  (String name, String value) { date_of_start.put(name, value);}
  public static void date_of_end    (String name, String value) { date_of_end.put(name, value);}
  public static void requires1        (String name, String value) { requires1.put(name, value);}
  public static void requires2         (String name, String value) { requires2.put(name, value);}
  public static void requires3         (String name, String value) { requires3.put(name, value);}
  public static void excludes1         (String name, String value) { excludes1.put(name, value);}
  public static void excludes2         (String name, String value) { excludes2.put(name, value);}
  public static void excludes3         (String name, String value) { excludes3.put(name, value);}
  public static void short_headline         (String name, String value) { short_headline.put(name, value);}
  public static void ad_type         (String name, String value) { ad_type.put(name, value);}
  public static void size         (String name, String value) { size.put(name, value);}
  public static void html_code         (String name, String value) { html_code.put(name, value);}

  public static String getEmail            (String name) { return email.get(name);  }
  public static String getPassword         (String name) { return password.get(name);  }
  public static String get_url_panel       (String name) { return url_panel.get(name);  }
  public static String get_url_mailcatcher (String name) { return url_mailcatcher.get(name);  }
  public static String get_url_mailhog     (String name) { return url_mailhog.get(name);  }
  public static String get_url_target      (String name) { return url_target.get(name);  }
  public static Object getId               (String name) { return id.get(name); }
  public static String getLista1           (String name) { return lista1.get(name); }
  public static String getLista2           (String name) { return lista2.get(name); }
  public static String getLista3           (String name) { return lista3.get(name); }
  public static String get_campaign_name   (String name) { return campaign_name.get(name); }
  public static String get_target_url      (String name) { return target_url.get(name); }
  public static String get_bid_strategy    (String name) { return bid_strategy.get(name); }
  public static String get_bid_value       (String name) { return bid_value .get(name); }
  public static String get_budget (String name) { return budget.get(name); }
  public static String get_date_of_start   (String name) { return date_of_start.get(name); }
  public static String get_date_of_end     (String name) { return date_of_end .get(name); }
  public static String get_requires1           (String name) { return requires1.get(name); }
  public static String get_requires2           (String name) { return requires2.get(name); }
  public static String get_requires3           (String name) { return requires3.get(name); }
  public static String get_excludes1           (String name) { return excludes1.get(name); }
  public static String get_excludes2           (String name) { return excludes2.get(name); }
  public static String get_excludes3           (String name) { return excludes3.get(name); }
  public static String get_short_headline      (String name) { return short_headline.get(name); }
  public static String get_ad_type             (String name) { return ad_type.get(name); }
  public static String get_size                (String name) { return size.get(name); }
  public static String get_html_code           (String name) { return html_code.get(name); }
//  public static String get_BasicInformation     (String name) {
//    return campaign_name.get(name);
//           target_url.get(name);
//           bid_strategy.get(name);
//    return bid_value .get(name);
//    return budget.get(name);
//    return date_of_start.get(name);
//    return date_of_end .get(name);
//  }
}
