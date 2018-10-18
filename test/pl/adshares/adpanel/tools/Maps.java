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
  private static HashMap<String, String> campaign_name;

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
  public static void createCampaign() {
    campaign_name = new HashMap<>();
  }
  public static void createId() {
    id = new HashMap<>();
  }

  public static void email          (String name, String value) {
    email.put(name, value);
  }
  public static void password       (String name, String value) {
    password.put(name, value);
  }
  public static void id             (String name, int value)    { id.put(name, value);  }
  public static void url_panel      (String name, String value) { url_panel.put(name, value);}
  public static void url_mailcatcher(String name, String value) { url_mailcatcher.put(name, value);}
  public static void url_mailhog    (String name, String value) { url_mailhog.put(name, value);}
  public static void url_target     (String name, String value) { url_target.put(name, value);}
  public static void lista1         (String name, String value) { lista1.put(name, value);}
  public static void lista2         (String name, String value) { lista2.put(name, value);}
  public static void lista3         (String name, String value) { lista3.put(name, value);}
  public static void campaign_name  (String name, String value) { campaign_name.put(name, value);}

  public static String getEmail            (String name) { return email.get(name);  }
  public static String getPassword         (String name) { return password.get(name);  }
  public static String get_url_panel       (String name) { return url_panel.get(name);  }
  public static String get_url_mailcatcher (String name) { return url_mailcatcher.get(name);  }
  public static String get_url_mailhog     (String name) { return url_mailhog.get(name);  }
  public static String get_url_target       (String name) { return url_target.get(name);  }
  public static Object getId               (String name) { return id.get(name); }
  public static String getLista1               (String name) { return lista1.get(name); }
  public static String getLista2               (String name) { return lista2.get(name); }
  public static String getLista3               (String name) { return lista3.get(name); }
  public static String get_campaign_name              (String name) { return campaign_name.get(name); }

}
