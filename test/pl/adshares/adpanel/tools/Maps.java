package pl.adshares.adpanel.tools;
import java.util.HashMap;

public class Maps {

  private static HashMap<String, String> email;
  private static HashMap<String, String> password;
  private static HashMap<String, String> url_panel;
  private static HashMap<String, String> url_mailcatcher;
  private static HashMap<String, Integer> id;

  public static void create() {
    email = new HashMap<>();
    password = new HashMap<>();
  }
  public static void url() {
    url_panel = new HashMap<>();
    url_mailcatcher = new HashMap<>();
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

  public static String getEmail            (String name) { return email.get(name);  }
  public static String getPassword         (String name) { return password.get(name);  }
  public static String get_url_panel       (String name) { return url_panel.get(name);  }
  public static String get_url_mailcatcher (String name) { return url_mailcatcher.get(name);  }
  public static Object getId               (String name) { return id.get(name); }

}
