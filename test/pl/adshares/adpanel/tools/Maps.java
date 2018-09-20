package pl.adshares.adpanel.tools;
import java.util.HashMap;

public class Maps {

  private static HashMap<String, String> email;
  private static HashMap<String, String> password;
  private static HashMap<String, Integer> id;

  public static void create() {
    email = new HashMap<>();
    password = new HashMap<>();
  }
  public static void createId() {
    id = new HashMap<>();
  }

  public static void email    (String name, String value) {
    email.put(name, value);
  }
  public static void password (String name, String value) {
    password.put(name, value);
  }
  public static void id       (String name, int value) {
    id.put(name, value);
  }

  public static Object getEmail(String name) {
    return email.get(name);
  }
  public static Object getPassword(String name) {
    return password.get(name);
  }
  public static Object getId(String name) {
    return id.get(name);
  }

}
